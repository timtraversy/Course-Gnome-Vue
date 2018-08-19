import { db } from '../main'

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

export async function pullCourses (school, store) {
  let docRef = db.collection('schools').doc(school)
  let metadata = await docRef.get()
  let version = metadata.data().version

  var courseData = JSON.parse(localStorage.getItem(`${school}-courses`))

  if (courseData) {
    if (courseData['version'] === version) {
      console.log('Data on file for: ', school)
      store.commit('updateCourseData', courseData['courses'])
      return true
    } else {
      console.log('Either not on file or out of data for: ', school)
    }
  }

  console.log('Need to fetch from server. Fetching...')
  docRef = db.collection('schools/' + school + '/fall2018_courses')
  let courses = await docRef.get()
  let courseArray = []
  courses.forEach(function (course) {
    courseArray.push({
      id: course.id,
      data: course.data()
    })
  })
  let updateObj = {courses: courseArray, version: version}
  localStorage.setItem(`${school}-courses`, JSON.stringify(updateObj))
  store.commit('updateCourseData', courseArray)
  console.log('Courses fetched: ', updateObj)
  return true
}

export async function voteOnSchool (school) {
  console.log(this.$store.state.blockId)
  try {
    let docRef = db.collection('school_votes').doc(school)
    let result = await docRef.get()
    if (result.exists) {
      const votes = result.data().votes
      docRef.set({votes: votes + 1})
      console.log('Incremented school: ', school)
      return votes + 1
    } else {
      docRef.set({votes: 1})
      console.log('Added new school')
      return 1
    }
  } catch (err) {
    console.log('voteOnSchool', err)
    return false
  }
}

export async function search (searchObject, school, store) {
  console.log('Running search')
  var results = store.state.courseData
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
    // return (a.data.departmentAcronym - b.data.departmentAcronym)
    // if (a.data.departmentNumber > b.data.departmentNumber) {
    //   if (a.data.departmentAcronym > b.data.departmentAcronym) {
    //     if (a.data.sectionNumber > b.data.sectionNumber) {
    //       return 1
    //     } else {
    //       return -1
    //     }
    //   } else if (a.data.departmentAcronym < b.data.departmentAcronym) {
    //     return -1
    //   } else {
    //     return 0
    //   }
    // } else if (a.data.departmentNumber < b.data.departmentNumber) {
    //   return -1
    // }
  })
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
