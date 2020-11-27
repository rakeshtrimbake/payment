const express = require("express");
const app = express();
const ejs = require("ejs");
const pdf = require("html-pdf");
const path = require("path");
const fs = require('fs');
const moment = require('moment/moment');
app.use( express.static( "public" ) );
app.use(express.json());
app.set('view engine', 'ejs')
const PORT = process.env.PORT || 4000;

const reports = {
    "report_period":"November 2020",
    "reports": [
        {
            "information": {
                "employee_id": "01b2648b-c0b3-474f-b148-bd3ac06df83f",
                "pay_cycle": "Nov 26 - Dec 25",
                "salary": 50000,
                "employee_name": "Aadi Alsi",
                "phone_number": "+18609952882",
                "worker_type": "Monthly",
                "pay_cycle_start_date": "2020-11-26",
                "pay_cycle_end_date": "2020-12-25",
                "name": "Aadi Alsi",
                "is_historical": true
            },
            "attendance": {
                "present_days": 2,
                "absent_days": 0,
                "half_days": 0,
                "paid_holidays": 0
            },
            "salary": {
                "ledger_id": "833bb052-3042-4261-8bfd-f60888254b32",
                "salary_id": "833bb052-3042-4261-8bfd-f60888254b32",
                "total_salary_owed": 3333.3333333333335,
                "net_salary": 3333.3333333333335,
                "payments": 0,
                "net_payable": 3333.3333333333335,
                "previous_balance": 50000,
                "total_payable": 53333,
                "salary_ledger": [],
                "payments_ledger": []
            },
            "profile": {
                "employee_id": "01b2648b-c0b3-474f-b148-bd3ac06df83f",
                "pay_cycle": "Nov 26 - Dec 25",
                "salary": 50000,
                "employee_name": "Aadi Alsi",
                "phone_number": "+18609952882",
                "worker_type": "Monthly",
                "pay_cycle_start_date": "2020-11-26",
                "pay_cycle_end_date": "2020-12-25",
                "name": "Aadi Alsi",
                "is_historical": true
            }
        },
        {
            "information": {
                "employee_id": "2d2ccec3-7f3e-4988-84c6-fc489e358cf7",
                "pay_cycle": "Nov 26 - Dec 25",
                "salary": 50630,
                "employee_name": "Alexander Fourozan",
                "phone_number": "+13107402534",
                "worker_type": "Daily",
                "pay_cycle_start_date": "2020-11-26",
                "pay_cycle_end_date": "2020-12-25",
                "name": "Alexander Fourozan",
                "is_historical": true
            },
            "attendance": {
                "present_days": 2,
                "absent_days": 0,
                "half_days": 0,
                "paid_holidays": 0
            },
            "salary": {
                "ledger_id": "3a07360b-5597-4cd7-801d-c8e325d3fbff",
                "salary_id": "3a07360b-5597-4cd7-801d-c8e325d3fbff",
                "total_salary_owed": 101260,
                "net_salary": 101260,
                "payments": 0,
                "net_payable": 101260,
                "previous_balance": 0,
                "total_payable": 101260,
                "salary_ledger": [],
                "payments_ledger": []
            },
            "profile": {
                "employee_id": "2d2ccec3-7f3e-4988-84c6-fc489e358cf7",
                "pay_cycle": "Nov 26 - Dec 25",
                "salary": 50630,
                "employee_name": "Alexander Fourozan",
                "phone_number": "+13107402534",
                "worker_type": "Daily",
                "pay_cycle_start_date": "2020-11-26",
                "pay_cycle_end_date": "2020-12-25",
                "name": "Alexander Fourozan",
                "is_historical": true
            }
        }
    ],
    "summary": {
        "total_salary_owed": 104593.33333333333,
        "payments": 0,
        "previous_balance": 50000
    }
}

const totalDue = reports.reports.reduce((cur,next) => {
    return cur.salary.total_payable +next.salary.total_payable;
})

app.get("/generatePayment", (req, res) => {
   
    ejs.renderFile(path.join(__dirname, './views/', "payment.ejs"), {reports,moment:moment,due:totalDue}, (err, data) => {
    if (err) {
        console.log(err)
          res.send(err);
    } else {

        let options = {
            "height": "11.25in",
            "width": "8.5in",
            "header": {
                "height": "-.9in"
            },
            "footer": {
                "height": "20mm",
            },
        };
        pdf.create(data, options).toFile("report.pdf", function (err, data) {
            if (err) {
                res.send(err);
            } else {

                return res.download('report.pdf',() => {
                    fs.unlinkSync('report.pdf');
                });
            }
        });
    }

});

})
app.listen(PORT,() => {
    console.log(`Server is running on port ${PORT}`)
});
