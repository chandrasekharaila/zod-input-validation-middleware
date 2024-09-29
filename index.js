const express = require("express")
const zod = require("zod")
const app = express()
const port = 3000

app.use(express.json())

let students = [
    {
        "name": "Aila Chandra Sekhar",
        "roll_number": "20471A05D2",
        "year": 4,
        "section": "cse-c",
        "fee_dues": 65000,
        "marks": {
          "html": 100,
          "css": 100,
          "javascript": 95,
          "react": 90,
          "express": 70
        }
      },
      {
        "name": "Mondeddu Ajay Reddy",
        "roll_number": "20471A05G3",
        "year": 4,
        "section": "cse-c",
        "fee_dues": 65000,
        "marks": {
          "html": 100,
          "css": 100,
          "javascript": 95,
          "react": 90,
          "express": 70
        }
      },
    {
        "name": "Rachupalli Pavan",
        "roll_number": "20471A05H6",
        "year": 4,
        "section": "cse-c",
        "fee_dues": 65000,
        "marks": {
          "html": 100,
          "css": 100,
          "javascript": 95,
          "react": 90,
          "express": 70
        }
      },
      {
        "name": "Ashwin Rajendran",
        "roll_number": "20471A05D6",
        "year": 4,
        "section": "cse-c",
        "fee_dues": 65000,
        "marks": {
          "html": 100,
          "css": 100,
          "javascript": 95,
          "react": 90,
          "express": 70
        }
      },
      {
        "name": "Rayini Venkatesh",
        "roll_number": "20471A05H9",
        "year": 4,
        "section": "cse-c",
        "fee_dues": 65000,
        "marks": {
          "html": 100,
          "css": 100,
          "javascript": 95,
          "react": 90,
          "express": 70
        }
      }
]



const getMarksSchema = zod.string().min(9).max(10)
const getFeedueSchema = zod.string().min(9).max(10)
const postAddStudentSchema = zod.object({
    name: zod.string(),
    roll_number: zod.string().min(9).max(10),
    year: zod.number(),
    section: zod.string(),
    fee_dues: zod.number(),
    marks: zod.object({
        html: zod.number().min(0).max(100),
        css: zod.number().min(0).max(100),
        javascript: zod.number().min(0).max(100),
        react: zod.number().min(0).max(100),
        express: zod.number().min(0).max(100),
    })
})
const putUpdateFeeSchema = zod.object({
    roll_number: zod.string().min(9).max(10),
    newFee : zod.number()
})
const deleteStudentSchema = zod.string().min(9).max(10)






//Get marks input validation middleware
const validateGetMarks = (req, res, next) => {
    const { roll_number } = req.headers
    let validateInput = getMarksSchema.safeParse(roll_number)
    if (validateInput.success) {
        next()
    } else {
        return res.status(400).send({msg: "Invalid Input Format Beta"})
    }
}




//get feedues input validation middleware
const validateGetFeedue = (req, res, next) => {
    const { roll_number } = req.query
    let validateInput = getFeedueSchema.safeParse(roll_number)
    if (validateInput.success) {
        next()
    } else {
        return res.status(400).send({msg: "Invalid Input Format Beta"})
    }
}

//post addstudent input validation middleware
const validatePostAddStudent = (req, res, next) => {
    const { name, roll_number, year, section, fee_dues, marks } = req.body
    let addstud = {
        name: name,
        roll_number: roll_number,
        year: year,
        section: section,
        fee_dues: fee_dues,
        marks: marks
    }
    let validateInput = postAddStudentSchema.safeParse(addstud)
    if (validateInput.success) {
        next()
    } else {
        return res.status(400).send({msg : "Invalid Input Format Beta"})
    }
}

//put updatefee input validation middleware
const validatePutUpdateFee = (req, res, next) => {
    const { roll_number, newFee } = req.body; 
    
    let validateInput = putUpdateFeeSchema.safeParse({
        roll_number: roll_number,
        newFee: newFee
    })
    if (validateInput.success) {
        next()
    } else {
        return res.status(400).send({msg:"Invalid Input Format Beta"})
    }
}

//delete deletestudent input validation middleware
const validateDeleteStudent = (req, res, next) => {
    const roll_number = req.params.id;
    const validateInput = deleteStudentSchema.safeParse(roll_number)
    if (validateInput.success) { 
        next()
    } else {
        return res.status(400).send({msg: "Invalid Input Format Beta"})
    }
}


app.get("/allstudents", (req, res) => {
    res.send(students)
})




app.get("/marks",validateGetMarks, (req, res) => {
    const { roll_number } = req.headers
    const student = students.find(st => st.roll_number === roll_number)
    if (!student) {
        return res.status(400).send({msg:"student not found"})
    } else {
        return res.send({
            name: student.name,
            roll_number: student.roll_number,
            marks: student.marks
        })
    }
})




app.get("/feedue",validateGetFeedue, (req, res) => {
    const { roll_number } = req.query
    let student = students.find(st => st.roll_number === roll_number)
    if (!student) {
        return res.status(400).send({msg:"student not found"})
    } else {
        return res.send({
            name: student.name,
            roll_number: student.roll_number,
            fee_due: student.fee_dues
        })
    }
})






app.post("/addstudent", validatePostAddStudent, (req, res) => {
    const { name, roll_number, year, section, fee_dues, marks } = req.body
    let addstud = {
        name: name,
        roll_number: roll_number,
        year: year,
        section: section,
        fee_dues: fee_dues,
        marks: marks
    }
    let student = students.find((st) => st.roll_number === roll_number)
    if (student) {
        return res.status(404).send({ msg: `roll number already exist beta` })
    } else {
        const newstudents = {
            name: name,
            roll_number: roll_number,
            year: year,
            section: section,
            fee_dues: fee_dues,
            marks: marks
        }
        students.push(newstudents)

        return res.send({
            msg: "Student added successfully.",
            ...addstud
        });
    }
})


app.put("/updatefee", validatePutUpdateFee, (req, res) => {
    const { roll_number, newFee } = req.body;
    let student = students.find((st) => st.roll_number === roll_number);
    if (!student) {
        return res.status(404).send({ msg: "Student not found" });
    } else {
        student.fee_dues = parseInt(newFee)
        return res.send({
            ...student,
        })
  
    }
})



app.delete("/deletestudent/:id", validateDeleteStudent, (req, res) => {
    const roll_number = req.params.id;
    let studentIndex = students.findIndex(st => st.roll_number === roll_number);

    if (studentIndex === -1) {
        return res.status(404).send({ msg: "Student not found" }); 
    } else {  
        students.splice(studentIndex, 1);
        return res.send({ msg: "Student deleted successfully", students });
    }
});


 

app.listen(port, () => {
    console.log(`server is live at ${port}`)
})