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

export function getDropdownData (school, store) {
  let instructors = []
  let departments = []
  for (let i = 0; i < store.state.courseData.length; ++i) {
    let course = store.state.courseData[i].data
    if (course.instructors) {
      for (let j = 0; j < course.instructors.length; ++j) {
        let instructor = course.instructors[j]
        if (instructor && !instructors.includes(instructor)) {
          instructors.push(instructor)
        }
      }
    }
    if (course.departmentName && !departments.includes(course.departmentName)) {
      departments.push(course.departmentName)
    }
  }
  return {
    instructors: instructors.sort(),
    departments: departments.sort()
  }
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
    console.log('Done...')
    store.commit('updateCourseData', courseArray)
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

export async function search (searchObject, school, store) {
  console.log('Running search')
  var results = []
  // filter
  for (var k = 0; k < store.state.courseData.length; ++k) {
    var result = store.state.courseData[k]
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
    if (searchObject.time[0] !== '8:00 AM' || searchObject.time[1] !== '10:00 PM') {
      if (result.data.classTimes.length !== 0 && result.data.classTimes[0].startTime) {
        var withinTimeBounds = true
        for (var p = 0; p < result.data.classTimes.length; ++p) {
          const startClassTime = moment(result.data.classTimes[0].startTime)
          const endClassTime = moment(result.data.classTimes[0].endTime)
          const startSearchTime = moment('Mon Jan 01 1900 ' + searchObject.time[0] + ' GMT-0500', 'ddd MMM D YYYY hh:mm A')
          const endSearchTime = moment('Mon Jan 01 1900 ' + searchObject.time[1] + ' GMT-0500', 'ddd MMM D YYYY hh:mm A')
          if (startClassTime.isBefore(startSearchTime)) {
            withinTimeBounds = false
            break
          }
          if (endClassTime.isAfter(endSearchTime)) {
            withinTimeBounds = false
            break
          }
        }
        if (!withinTimeBounds) {
          continue
        }
      } else {
        continue
      }
    }
    if (result.data.departmentNumber) {
      if (result.data.departmentNumber < searchObject.number[0] || result.data.departmentNumber > searchObject.number[1]) {
        continue
      }
    }
    if (searchObject.monday || searchObject.tuesday || searchObject.wednesday || searchObject.thursday || searchObject.friday) {
      if (result.data.classTimes.length !== 0) {
        let notInTime = false
        for (var x = 0; x < result.data.classTimes.length; ++x) {
          let course = result.data.classTimes[0]
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
  store.commit('updateTotalResultCount', results.length)
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
  store.commit('updateResults', finalOfferings)
}
