"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Op } = require('sequelize');
const { Student, Classroom } = require('../src/models');
const Query = {
    getAllClassroom: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield Classroom.findAll();
            return data;
        }
        catch (err) {
            console.log(err);
        }
    }),
    getClassroom: (root, { name }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const classrooms = yield Classroom.findOne({
                where: { name },
                // include: {
                //   model: Student,
                //   as: 'students'
                // }
            });
            return classrooms;
        }
        catch (err) {
            console.log(err);
        }
    }),
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
    getStudent: (root, { where, sort, offset, limit, search }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newSort = Object.keys(sort !== null && sort !== void 0 ? sort : {}).map((key) => {
                return [key, sort[key]];
            });
            const handleSearch = search ? {
                [Op.or]: [
                    {
                        name: { [Op.iLike]: `%${search}%` }
                    },
                    {
                        gender: { [Op.iLike]: `%${search}%` }
                    }
                ]
            } : null;
            const detail = yield Student.findAll({
                where: Object.assign(Object.assign({}, where), handleSearch),
                order: newSort,
                offset,
                limit
            });
            return detail;
        }
        catch (err) {
            console.log(err);
        }
    }),
    getStudentByGender: (root, { where }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const detail = yield Student.findAll({
                where
            });
            return detail;
        }
        catch (err) {
            console.log(err);
        }
    })
};
const Mutation = {
    createStudent: (root, { name, age, gender }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Student.create({
                name,
                age,
                gender
            });
            return "Student created successfully";
        }
        catch (err) {
            console.log(err);
        }
    }),
    createClassroom: (root, { name }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Classroom.create({
                name
            });
            return "Classroom created successfully";
        }
        catch (err) {
            console.log(err);
        }
    }),
    assignStudentToClassroom: (root, { student_id, classroom_id }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield Student.update({
                classroom_id
            }, { where: { id: student_id } });
            return "Assign student to classroom successfully";
        }
        catch (err) {
            console.log(err);
        }
    })
};
const ClassroomResolver = {
    students: (root, { where, sort, offset, limit }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newSort = Object.keys(sort !== null && sort !== void 0 ? sort : {}).map((key) => {
                return [key, sort[key]];
            });
            const students = yield Student.findAll({
                where: Object.assign(Object.assign({}, where), { classroom_id: root.dataValues.id }),
                order: newSort,
                offset,
                limit
            });
            return students;
        }
        catch (err) {
            console.log(err);
        }
    })
};
const studentResolver = {
    classroom: (root) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const detail = yield Classroom.findOne({
                where: {
                    id: root.dataValues.classroom_id
                }
            });
            return detail;
        }
        catch (err) {
            console.log(err);
        }
    })
};
module.exports = { Query, Mutation, Classroom: ClassroomResolver, Student: studentResolver };
