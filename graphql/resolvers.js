const { Student, Classroom } = require('../src/models');

const Query = {
  getAllStudent: async () => {
    try {
      const students = await Student.findAll();
      return students
    } catch (err) {
      console.log(err)
    }
  },
  getClassroom: async (root, { name }) => {
    try {
      const classrooms = await Classroom.findOne({
        where: { name },
        // include: {
        //   model: Student,
        //   as: 'students'
        // }
      })
      return classrooms
    } catch (err) {
      console.log(err);
    }
  },
  // getStudent: async (root, {age, name, offset, limit}) => {
  //   try {
  //     const detail = await Student.findAll({
  //       where: {age}, 
  //       order: [['name', name]],
  //       offset,
  //       limit
  //     })
  //     return detail
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }
  getStudent: async (root, {where, sort, offset, limit}) => {
    try {
      const newSort = Object.keys(sort ?? {}).map(key => {
        return [key, sort[key]]
      })
      console.log(newSort);
      const detail = await Student.findAll({
        where, 
        order: newSort,
        offset,
        limit
      })
      return detail
    } catch (err) {
      console.log(err);
    }
  },
  getStudentByGender: async (root, {where}) => {
    try {
      const detail = await Student.findAll({
        where
      })
      return detail
    } catch (err) {
      console.log(err);
    }
  }
}

const Mutation = {
  createStudent: async (root, {
    name,
    age,
    gender
  }) => {
    try {
      await Student.create({
        name,
        age,
        gender
      })
      return "Student created successfully"
    } catch (err) {
      console.log(err)
    }
  },
  createClassroom: async (root, {
    name
  }) => {
    try {
      await Classroom.create({
        name
      })
      return "Classroom created successfully"
    } catch (err) {
      console.log(err)
    }
  },
  assignStudentToClassroom: async (root, {
    student_id,
    classroom_id
  }) => {
    try {
      await Student.update({
        classroom_id
      },{ where:{ id: student_id} })
      return "Assign student to classroom successfully"
    } catch (err) {
      console.log(err)
    }
  }
}

const ClassroomResolver = {
  students: async (root, {where, sort, offset, limit}) => {
    try {
      const newSort = Object.keys(sort ?? {}).map(key => {
        return [key, sort[key]]
      })
      const students = await Student.findAll({
        where:{
          ...where, 
          classroom_id: root.dataValues.id
        }, 
        order: newSort,
        offset,
        limit
      });
      return students
    } catch (err) {
      console.log(err)
    }
  }
}

const studentResolver = {
  classroom: async (root) => {
    try {
      const detail = await Classroom.findOne({
        where: {
          id: root.dataValues.classroom_id
        }
      });
      return detail
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = { Query, Mutation, Classroom:ClassroomResolver, Student:studentResolver }