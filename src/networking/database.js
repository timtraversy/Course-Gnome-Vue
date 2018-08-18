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
  for (let i = 0; i < store.state.courseData[school].length; ++i) {
    let course = store.state.courseData[school][i].data
    if (!instructors.includes(course.instructors)) {
      instructors.push(course.instructors)
    }
    if (!departments.includes(course.departmentName)) {
      departments.push(course.departmentName)
    }
  }
  return {
    instructors: instructors,
    departments: departments
  }
}

export async function pullCourses (school, store) {
  var courseData = JSON.parse(localStorage.getItem('courseData'))
  if (courseData) {
    if (courseData[school]) {
      console.log('Data on file for: ', school)
      store.commit('updateCourseData', {school: 'gwu', data: courseData[school]})
    }
  } else {
    console.log('Need to fetch from server. Fetching...')
    // console.log('getting courses')
    let docRef = db.collection('schools/' + school + '/fall2018_courses')
    let courses = await docRef.get()
    let courseArray = []
    courses.forEach(function (course) {
      courseArray.push({
        id: course.id,
        data: course.data()
      })
    })
    store.commit('updateCourseData', {school: 'gwu', data: courseArray})
    console.log('Courses fetched')
  }
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

/* export async function search (searchObject, school) {
  console.log('Running search')
  var offeringsRef = db.collection('/schools/emerson/fall2018')
  // .where('departmentAcronym', '==', department.acronym).where('departmentAcronym', '==', 'TH')
  var results = []
  var self = this
  offeringsRef.get().then(function (querySnapshot) {
    querySnapshot.forEach(function (offering) {
      var newOffering = {}
      newOffering.id = offering.id
      newOffering.data = offering.data()
      results.push(newOffering)
    })
    results.sort(function (a, b) {
      if (a.data.departmentNumber > b.data.departmentNumber) {
        if (a.data.departmentAcronym > b.data.departmentAcronym) {
          if (a.data.sectionNumber > b.data.sectionNumber) {
            return 1
          } else {
            return -1
          }
        } else if (a.data.departmentAcronym < b.data.departmentAcronym) {
          return -1
        } else {
          return 0
        }
      } else if (a.data.departmentNumber < b.data.departmentNumber) {
        return -1
      }
    })
    var finalOfferings = []
    var j = -1
    var previousNumber = ''
    var previousAcronym = ''
    var previousName = ''
    for (var i = 0; i < results.length; ++i) {
      // if another offering of last course, add it to that list
      if (previousNumber === results[i].data.departmentNumber &&
        previousAcronym === results[i].data.departmentAcronym &&
        previousName === results[i].data.name) {
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
      self.waitingForResults = false
      self.$store.commit('updateResults', finalOfferings)
    })
    .catch(function (error) {
      console.log('Error getting documents: ', error)
    })
  }
}
  */
