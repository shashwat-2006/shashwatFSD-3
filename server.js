const express = require("express");

const app = express();
const PORT = 3001;

app.use(express.json());

let leaves = [
    {
        id: 701,
        employeeName: "Ananya Singh",
        employeeCode: "EMP101",
        leaveType: "Casual",
        days: 2,
        status: "Pending"
    },
    {
        id: 702,
        employeeName: "Rahul Verma",
        employeeCode: "EMP102",
        leaveType: "Sick",
        days: 1,
        status: "Approved"
    },
    {
        id: 703,
        employeeName: "Simran Kaur",
        employeeCode: "EMP103",
        leaveType: "Earned",
        days: 3,
        status: "Rejected"
    }
];

function validateLeave(data) {
    const {
        employeeName,
        employeeCode,
        leaveType,
        days,
        status
    } = data;

    if (!employeeName || !employeeCode || !leaveType ||
        days === undefined || !status) {
        return "All fields are required";
    }

    if (!Number.isInteger(days) || days <= 0) {
        return "Days must be a positive integer";
    }

    if (!["Casual", "Sick", "Earned"].includes(leaveType)) {
        return "Invalid leave type";
    }

    if (!["Pending", "Approved", "Rejected"].includes(status)) {
        return "Invalid status";
    }

    return null;
}

app.get("/api/leaves", (req, res) => {
    res.status(200).json(leaves);
});

app.post("/api/leaves", (req, res) => {
    const error = validateLeave(req.body);

    if (error) {
        return res.status(400).json({ message: error });
    }

    const newLeave = {
        id: Math.max(0, ...leaves.map(l => l.id)) + 1,
        ...req.body
    };

    leaves.push(newLeave);

    res.status(201).json(newLeave);
});

app.get("/api/leaves/filter", (req, res) => {
    const status = req.query.status;

    if (!status) {
        return res.status(400).json({
            message: "Please provide status"
        });
    }

    const result = leaves.filter(
        l => l.status.toLowerCase() === status.toLowerCase()
    );

    res.status(200).json(result);
});

app.get("/api/leaves/pending", (req, res) => {
    const result = leaves.filter(
        l => l.status === "Pending"
    );

    res.status(200).json(result);
});

app.get("/api/leaves/:id", (req, res) => {
    const id = Number(req.params.id);

    const leave = leaves.find(l => l.id === id);

    if (!leave) {
        return res.status(404).json({
            message: "Record not found"
        });
    }

    res.status(200).json(leave);
});

app.put("/api/leaves/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = leaves.findIndex(l => l.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Record not found"
        });
    }

    const error = validateLeave(req.body);

    if (error) {
        return res.status(400).json({
            message: error
        });
    }

    leaves[index] = {
        id: id,
        ...req.body
    };

    res.status(200).json(leaves[index]);
});

app.delete("/api/leaves/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = leaves.findIndex(l => l.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Record not found"
        });
    }

    leaves.splice(index, 1);

    res.status(200).json({
        message: "Leave deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});