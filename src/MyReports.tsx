import { type } from "@testing-library/user-event/dist/type"
import React, { useEffect, useState } from "react"
 import { HiOutlineDocumentReport } from 'react-icons/hi'; // Import the icon from react-icons
interface MyReportsProps {
    tsURL: string,
    collapseFilters: ()=>void
}
const MyReports: React.FC<MyReportsProps> = ({tsURL,collapseFilters}: MyReportsProps) => {

    const [restAnswers, setRestAnswers] = useState([])
    const [dropdownVisible, setDropdownVisible] = useState(false)
    const loadReport = (id: string) => {
        const event = new CustomEvent('loadExistingReport', {detail: {data: {
            id: id}
        }});
        window.dispatchEvent(event)
        collapseFilters();
        setDropdownVisible(false);
    }
    useEffect(()=>{


        var baseURL = tsURL.replace("#/","").replace("#","")
        fetch(baseURL+"callosum/v1/tspublic/v1/metadata/list?type=QUESTION_ANSWER_BOOK&category=MY",
        {
            credentials: 'include',
        })
        .then(response => response.json()).then(
            data => {
                setRestAnswers(data.headers)
            })

    },[])

    return (
      <div>
        <div className="flex font-bold w-38 h-full items-center hover:cursor-pointer hover:text-blue-500 text-xs" onClick={() => setDropdownVisible(!dropdownVisible)}>
          <HiOutlineDocumentReport className="text-lg text-gray-800" /> &nbsp;  <span className="text-gray-800">My Reports</span>
        </div>
        {dropdownVisible && (
          <div className="absolute mt-2 shadow-lg flex flex-col bg-white border border-gray-300 rounded-lg overflow-hidden" style={{ width: '500px' }}>
            {restAnswers.map((answer: any, index: number) => (
              <div 
                className={`hover:cursor-pointer hover:bg-blue-100 p-2 text-sm ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
                onClick={() => loadReport(answer.id)}
                key={answer.id} // Always use keys when mapping for React elements
              >
                  {answer.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
};

export default MyReports;