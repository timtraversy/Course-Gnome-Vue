import { db } from '../main'
import moment from 'moment'
import store from '../store/store'

// export async function getSchoolName (name) {
//   try {
//     let docRef = db.collection('schools').doc(name)
//     let school = await docRef.get()
//     if (school.exists) {
//       return school.data().name
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
  for (let i = 0; i < courseList.length; ++i) {
    if (courseList[i].data.instructors) {
      for (let j = 0; j < courseList[i].data.instructors.length; ++j) {
        let instructor = courseList[i].data.instructors[j]
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
      }
    }
    if (courseList[i].data.departmentName) {
      let department = courseList[i].data.departmentName
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
  }
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
  const docRef = db.collection('schools/' + school + '/fall2018_courses')
  try {
    let courses = await docRef.get()
    if (courses.size === 0) {
      return false
    }
    let courseArray = []
    courses.forEach(function (course) {
      courseArray.push({
        id: course.id,
        data: course.data()
      })
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
  console.log('Running search')
  if (store.getters.blankSearch) return []
  var results = []
  for (var k = 0; k < store.state.allCourses.length; ++k) {
    var result = store.state.allCourses[k]
    if (searchObject.name) {
      if (!result.data.name.toLowerCase().includes(searchObject.name.toLowerCase())) {
        continue
      }
    }
    if (searchObject.departmentName) {
      if (result.data.departmentName) {
        if (result.data.departmentName !== searchObject.departmentName) {
          continue
        }
      } else {
        continue
      }
    }
    if (searchObject.instructor) {
      if (result.data.instructors) {
        var found = false
        for (var m = 0; m < result.data.instructors.length; ++m) {
          const instructor = result.data.instructors[m]
          if (instructor === searchObject.instructor) {
            found = true
            break
          }
        }
        if (!found) {
          continue
        }
      } else {
        continue
      }
    }
    if (searchObject.startTime || searchObject.endTime) {
      if (result.data.classTimes) {
        var withinTimeBounds = true
        for (var p = 0; p < result.data.classTimes.length; ++p) {
          if (searchObject.startTime) {
            const startClassTime = moment(result.data.classTimes[p].startTime)
            const startSearchTime = moment('Mon Jan 01 1900 ' + searchObject.startTime + ' GMT-0500', 'ddd MMM D YYYY hh:mm A')
            if (startClassTime.isBefore(startSearchTime)) {
              withinTimeBounds = false
              break
            }
          }
          if (searchObject.endTime) {
            const endClassTime = moment(result.data.classTimes[p].endTime)
            const endSearchTime = moment('Mon Jan 01 1900 ' + searchObject.endTime + ' GMT-0500', 'ddd MMM D YYYY hh:mm A')
            if (endClassTime.isAfter(endSearchTime)) {
              withinTimeBounds = false
              break
            }
          }
        }
        if (!withinTimeBounds) {
          continue
        }
      } else {
        continue
      }
    }
    if (searchObject.startNumber) {
      if (result.data.departmentNumber) {
        if (searchObject.startNumber > result.data.departmentNumber) {
          continue
        }
      } else {
        continue
      }
    }
    if (searchObject.endNumber) {
      if (result.data.departmentNumber) {
        if (searchObject.endNumber < result.data.departmentNumber) {
          continue
        }
      } else {
        continue
      }
    }
    if (searchObject.monday || searchObject.tuesday || searchObject.wednesday || searchObject.thursday || searchObject.friday) {
      if (result.data.classTimes) {
        let notInTime = false
        for (var x = 0; x < result.data.classTimes.length; ++x) {
          let course = result.data.classTimes[x]
          if (searchObject.monday && !course.monday) {
            notInTime = true
            break
          }
          if (searchObject.tuesday && !course.tuesday) {
            notInTime = true
            break
          }
          if (searchObject.wednesday && !course.wednesday) {
            notInTime = true
            break
          }
          if (searchObject.thursday && !course.thursday) {
            notInTime = true
            break
          }
          if (searchObject.friday && !course.friday) {
            notInTime = true
            break
          }
        }
        if (notInTime) {
          continue
        }
      } else {
        continue
      }
    }
    if (result.data.status && (searchObject.open || searchObject.closed || searchObject.waitlist)) {
      if (result.data.status === 'OPEN' && !searchObject.open) {
        continue
      }
      if (result.data.status === 'CLOSED' && !searchObject.closed) {
        continue
      }
      if (result.data.status === 'WAITLIST' && !searchObject.waitlist) {
        continue
      }
    }
    results.push(result)
  }
  // sort
  // store.commit('updateTotalResultCount', results.count)
  results.sort(function (a, b) {
    if (a.data.departmentAcronym < b.data.departmentAcronym) {
      return -1
    } else if (a.data.departmentAcronym > b.data.departmentAcronym) {
      return 1
    } else {
      if (a.data.departmentNumber < b.data.departmentNumber) {
        return -1
      } else if (a.data.departmentNumber > b.data.departmentNumber) {
        return 1
      } else {
        if (a.data.sectionNumber < b.data.sectionNumber) {
          return -1
        } else if (a.data.sectionNumber > b.data.sectionNumber) {
          return 1
        } else {
          return 0
        }
      }
    }
  })
  // link same courses into one display
  var finalOfferings = []
  var j = -1
  var previousNumber = ''
  var previousAcronym = ''
  var previousName = ''
  for (var i = 0; i < results.length; ++i) {
    // if another offering of last course, add it to that list
    if (previousNumber === results[i].data.departmentNumber && previousAcronym === results[i].data.departmentAcronym && previousName === results[i].data.name) {
      finalOfferings[j].offerings.push(results[i])
      // otherwise make new course
    } else {
      finalOfferings.push(results[i])
      results[i].offerings = [results[i]]
      previousNumber = results[i].data.departmentNumber
      previousAcronym = results[i].data.departmentAcronym
      previousName = results[i].data.name
      j++
    }
  }
  return finalOfferings
}
