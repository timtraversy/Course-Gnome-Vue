import { db } from '../main'
import moment from 'moment'
import store from '../store/store'

// export async function getSchoolName (name) {
//   try {
//     let docRef = db.collection('schools').doc(name)
//     let school = await docRef.get()
//     if (school.exists) {
//       return school().name
//     } else {
//       return 'None'
//     }
//   } catch (err) {
//     console.log(err)
//   }
// }

export function getDropdownData (matchingCourses) {
  let instructorsData = {}
  let departmentsData = {}
  let globalData = {}

  let courseList = []
  if (matchingCourses.length !== 0) {
    courseList = matchingCourses.slice()
  } else {
    courseList = store.state.allCourses.slice()
  }

  courseList.forEach(function (course) {
    if (course.departmentName) {
      let department = course.departmentName
      departmentsData[department] ? ++departmentsData[department] : departmentsData[department] = 1
      if (globalData[department]) {
        ++globalData[department]['count']
      } else {
        const newObj = {
          'type': 'Department',
          'count': 1
        }
        globalData[department] = newObj
      }
    }
    course.offerings.forEach(function (offering) {
      if (offering.instructors) {
        offering.instructors.forEach(function (instructor) {
          instructorsData[instructor] ? ++instructorsData[instructor] : instructorsData[instructor] = 1
          if (globalData[instructor]) {
            ++globalData[instructor]['count']
          } else {
            const newObj = {
              'type': 'Instructor',
              'count': 1
            }
            globalData[instructor] = newObj
          }
        })
      }
    })
  })

  var instArray = []
  Object.keys(instructorsData).forEach(function (key) {
    instArray.push({'name': key, 'count': instructorsData[key]})
  })
  var deptArray = []
  Object.keys(departmentsData).forEach(function (key) {
    deptArray.push({'name': key, 'count': departmentsData[key]})
  })
  var globalArray = []
  Object.keys(globalData).forEach(function (key) {
    globalArray.push({'type': globalData[key]['type'], 'name': key, 'count': globalData[key]['count']})
  })
  instArray.sort(function (a, b) {
    return (b['count'] - a['count'])
  })
  deptArray.sort(function (a, b) {
    return (b['count'] - a['count'])
  })
  globalArray.sort(function (a, b) {
    return (b['count'] - a['count'])
  })
  return {'inst': instArray, 'dept': deptArray, 'global': globalArray}
}

export async function pullCourses (school) {
  console.log('Pulling...')
  const docRef = db.collection('schools/' + school + '/fall2018_courses').where('departmentAcronym', '==', 'BC')
  // const docRef = db.collection('schools/' + school + '/fall2018_courses')
  try {
    let courses = await docRef.get()
    if (courses.size === 0) {
      return false
    }
    let courseArray = []
    courses.forEach(function (course) {
      courseArray.push(course.data())
    })
    courseArray.sort(function (a, b) {
      if (a.departmentAcronym < b.departmentAcronym) {
        return -1
      } else if (a.departmentAcronym > b.departmentAcronym) {
        return 1
      } else {
        if (a.departmentNumber < b.departmentNumber) {
          return -1
        } else if (a.departmentNumber > b.departmentNumber) {
          return 1
        } else {
          return 0
        }
      }
    })
    store.commit('updateAllCourses', courseArray)
    console.log('Done...')
    return true
  } catch (err) {
    return false
  }
}

export async function voteOnSchool (school) {
  try {
    let docRef = db.collection('school_votes').doc(school)
    let result = await docRef.get()
    if (result.exists) {
      const votes = result.data().votes
      docRef.set({votes: votes + 1})
      return votes + 1
    } else {
      docRef.set({votes: 1})
      return 1
    }
  } catch (err) {
    return false
  }
}

export function search (searchObject) {
  // calculate ahead of time
  let startSearchTime = moment()
  let endSearchTime = moment()
  if (searchObject.startTime) startSearchTime = moment('Mon Jan 01 1900 ' + searchObject.startTime + ' GMT-0500', 'ddd MMM D YYYY hh:mm A')
  if (searchObject.endTime) endSearchTime = moment('Mon Jan 01 1900 ' + searchObject.endTime + ' GMT-0500', 'ddd MMM D YYYY hh:mm A')

  let count = 0

  let results = store.state.allCourses.reduce(function (filtered, course) {
    // course checks
    if (searchObject.name) {
      if (!course.name.toLowerCase().includes(searchObject.name.toLowerCase())) {
        return filtered
      }
    }
    if (searchObject.departmentName) {
      if (!course.departmentName || course.departmentName !== searchObject.departmentName) {
        return filtered
      }
    }
    if (searchObject.startNumber) {
      if (!course.departmentNumber || searchObject.startNumber > course.departmentNumber) {
        return filtered
      }
    }
    if (searchObject.endNumber) {
      if (!course.departmentNumber || searchObject.endNumber < course.departmentNumber) {
        return filtered
      }
    }
    // offering checks
    let offeringsArray = []
    let hasOneOffering = false
    course.offerings.forEach(function (offering) {
      if (searchObject.instructor) {
        if (!offering.instructors || offering.instructors.every(function (instructor) {
          return instructor !== searchObject.instructor
        })) return
      }
      if (searchObject.startTime) {
        if (!offering.classTimes || offering.classTimes.some(function (classTime) {
          return moment(classTime.startTime).isBefore(startSearchTime)
        })) return
      }
      if (searchObject.endTime) {
        if (!offering.classTimes || offering.classTimes.some(function (classTime) {
          return moment(classTime.endTime).isAfter(endSearchTime)
        })) return
      }
      if (searchObject.monday || searchObject.tuesday || searchObject.wednesday || searchObject.thursday || searchObject.friday) {
        if (!offering.classTimes || offering.classTimes.some(function (classTime) {
          return (searchObject.monday !== classTime.monday || searchObject.tuesday !== classTime.tuesday || searchObject.wednesday !== classTime.wednesday || searchObject.thursday !== classTime.thursday || searchObject.friday !== classTime.friday)
        })) return
      }
      if (searchObject.open || searchObject.waitlist || searchObject.closed) {
        if (!offering.status || (offering.status === 'OPEN' && !searchObject.open) || (offering.status === 'WAITLIST' && !searchObject.waitlist) || (offering.status === 'CLOSED' && !searchObject.closed)) return
      }
      offeringsArray.push(offering)
      hasOneOffering = true
      ++count
    })
    if (!hasOneOffering) return filtered
    const { offerings, ...other } = course
    filtered.push({ ...other, offerings: offeringsArray })
    return filtered
  }, [])
  // results.sort(function (a, b) {
  //   if (a.departmentAcronym < b.departmentAcronym) {
  //     return -1
  //   } else if (a.departmentAcronym > b.departmentAcronym) {
  //     return 1
  //   } else {
  //     if (a.departmentNumber < b.departmentNumber) {
  //       return -1
  //     } else if (a.departmentNumber > b.departmentNumber) {
  //       return 1
  //     } else {
  //       if (a.sectionNumber < b.sectionNumber) {
  //         return -1
  //       } else if (a.sectionNumber > b.sectionNumber) {
  //         return 1
  //       } else {
  //         return 0
  //       }
  //     }
  //   }
  // })
  store.commit('updateTotalResultCount', count)
  return results
}
