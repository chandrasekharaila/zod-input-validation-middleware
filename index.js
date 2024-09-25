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



 

app.get("/allstudents", (req, res) => {
    res.send(students)
})

app.get("/marks", (req, res) => {
    const { roll_number } = req.headers

    let validateInput = getMarksSchema.safeParse(roll_number)
    if (validateInput.success) {
        const student = students.find((st) => st.roll_number === roll_number)
        if (!student) {
            return res.status(404).send({ msg : "student not found"})
        }
        return res.send({
            name: student.name,
            roll_number: student.roll_number,
            marks : student.marks
        })
    } else {
        return res.status(400).send({msg:"wrong input format beta"})
    }
   
})

app.get("/feedue", (req, res) => {
    const { roll_number } = req.query

    const validateInput = getFeedueSchema.safeParse(roll_number)
    if (validateInput.success) {
        const student = students.find((st) => st.roll_number === roll_number)
        if (!student) {
           return res.status(404).send({ msg : "student not found"})
        }
        return res.send({
          name: student.name,
          roll_number: student.roll_number,
          fee_due: student.fee_dues
        })
    } else {
        return res.status(400).send({msg:"wrong input format beta"})
    }
})


app.post("/addstudent", (req, res) => {
    const { name, roll_number, year, section, fee_dues, marks } = req.body
    let addstud = {
        name: name,
        roll_number: roll_number,
        year: year,
        section: section,
        fee_dues: fee_dues,
        marks: marks
    }
    const validateInput = postAddStudentSchema.safeParse(addstud)
    if (validateInput.success) {
        let student = students.find((st) => st.roll_number === roll_number)
        if (student) {
           return res.status(404).send({ msg : `roll number already exist beta`})
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
    } else {
        return res.status(400).send({msg:"wrong input format beta"})
    }
    
})


app.put("/updatefee", (req, res) => {
    const { roll_number, newFee } = req.body;  

    let validateInput = putUpdateFeeSchema.safeParse({ roll_number: roll_number, newFee: parseInt(newFee) })
    if (validateInput.success) {
        let student = students.find((st) => st.roll_number === roll_number);

        if (!student) {
           return res.status(404).send({ msg: "Student not found" });
        } else {
           student.fee_dues = validateInput.data.newFee;
           return res.send({
               ...student,
        });
    }
    } else {
        return res.status(400).send({ msg:"wrong input format beta" })
    }
  
});


app.delete("/deletestudent/:id", (req, res) => {
    const roll_number = req.params.id;

   
    let validateInput = deleteStudentSchema.safeParse(roll_number);
    if (validateInput.success) {
        let studentIndex = students.findIndex(st => st.roll_number === roll_number);

        if (studentIndex === -1) {
            return res.status(404).send({ msg: "Student not found" }); 
        } else {  
            students.splice(studentIndex, 1);
            return res.send({ msg: "Student deleted successfully", students });
        }
    } else {
        return res.status(400).send({ msg:"wrong input format beta" });
    }   
});


 

app.listen(port, () => {
    console.log(`server is live at ${port}`)
})