const {Op} = require('sequelize');

const { Student, Classroom } = require('../src/models');

const Query = {
  getAllClassroom: async () => {
    try {
      const data = await Classroom.findAll();
      return data
    } catch (err) {
      console.log(err)
    }
  },
  getClassroom: async (root:any, { name }: {
    name: string
  }) => {
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
  getStudent: async (root:any, {where, sort, offset, limit, search}: {
    where: any,
    sort: string,
    offset: number,
    limit: number,
    search: string
  }) => {
    try {
      const newSort = Object.keys(sort ?? {}).map((key: any) => {
        return [key, sort[key]]
      })
      
      const handleSearch= search ? {
        [Op.or]:[
        {
          name: {[Op.iLike]:`%${search}%`}
        },
        {
          gender: {[Op.iLike]:`%${search}%`}
        }
      ]
    }:null
      const detail = await Student.findAll({
        where: {
          ...where,
          ...handleSearch
        }, 
        order: newSort,
        offset,
        limit
      })
      return detail
    } catch (err) {
      console.log(err);
    }
  },
  getStudentByGender: async (root:any, {where}: {where: string}) => {
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
  createStudent: async (root:any, {
    name,
    age,
    gender
  }: {name: string, age: number, gender: string}) => {
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
  createClassroom: async (root: any, {
    name
  }: {name: string}) => {
    try {
      await Classroom.create({
        name
      })
      return "Classroom created successfully"
    } catch (err) {
      console.log(err)
    }
  },
  assignStudentToClassroom: async (root: any, {
    student_id,
    classroom_id
  }: { student_id: number, classroom_id: number}) => {
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
  students: async (root:any, {where, sort, offset, limit}: {
    where: any,
    sort: string,
    offset: number,
    limit: number
  }) => {
    try {
      const newSort = Object.keys(sort ?? {}).map((key: any) => {
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
  classroom: async (root:any) => {
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