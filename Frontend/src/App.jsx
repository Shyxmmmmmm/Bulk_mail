import axios from "axios"
import { useState } from "react"
import * as XLSX from 'xlsx'
const App = () => {
  const [msg, setmsg] = useState()
  const [status, setstatus] = useState(false)
  const [emailList, setemailList] = useState([])
  const func = async () => {
    try {
      setstatus(true)
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/sendmail`,
        {
          msg: msg,
          email: emailList
        }
      )

      if (res.data === true) {
        alert("send successfully")
        console.log("working")
        setmsg("")
      }
      else {
        alert("failed")
      }

    }
    catch (err) {
      console.log(err)
      console.log(err.response)
      alert("server error")
      setstatus(false)
    }
  }

  const func2 = (event) => {
    const file = event.target.files[0]

    const reader = new FileReader()

    reader.onload = (event) => {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: "binary" })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const totalemail = emailList.map((item) => { return item.A })
      console.log(totalemail)
      setemailList(totalemail)
    }

    reader.readAsBinaryString(file)

  }

  return (
    <div>
      <div className="bg-blue-950">
        <h1 className="text-center p-4 font-bold text-2xl text-white">Bulk Mail</h1>
      </div>
      <div className="bg-blue-800">
        <h1 className="text-center p-4 font-semibold text-xl text-white">We can help your Business with sending multiple Emails</h1>
      </div>
      <div className="bg-blue-600">
        <h1 className="text-center p-4 font-semibold text-xl text-white">Drag and Drop</h1>
      </div>
      <div className="bg-blue-400 p-5 text-center">
        <textarea value={msg} onChange={(e) => { setmsg(e.target.value) }} name="" id="" className="bg-white lg:w-[50%] w-[70%] h-40 resize-none rounded p-5" placeholder="Enter the email....."></textarea>
        <div>
          <input type="file" onChange={func2} id="fileinput" className="border-4  border-white border-dashed p-4 mt-5" />
        </div>

        <p className="mt-4 text-white text-lg">Total Emails in the file: {emailList.length}</p>

        <button onClick={func} disabled={status} className="bg-blue-900 cursor-pointer w-20 mt-3 p-2 rounded text-white hover:bg-blue-950">{status ? "Sending" : "send"}</button>
      </div>

      <div className="bg-blue-600 h-10">
        <h1 className="text-center p-4 font-semibold text-xl text-white"></h1>
      </div>
      <div className="bg-blue-800 h-10">
        <h1 className="text-center p-4 font-semibold text-xl text-white"></h1>
      </div>
    </div>
  )
}

export default App