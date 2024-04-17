import { useEffect, useState } from "react"
import { FieldID } from "./DataDefinitions"
interface DropdownFilterProps {
    tsURL: string,
    field: string,
    fieldId: string,
    fieldLabel: string,
	setLoading?: (value: any)=>void,
    value: any[],
    runtimeFilters: {},
    setFilter: (value: any)=>void
    multiple: boolean,
	locked?: boolean,
    height:string
}
export const DropdownFilter: React.FC<DropdownFilterProps> = ({tsURL,field,fieldId, fieldLabel, setLoading, locked, value, runtimeFilters,setFilter,multiple,height}: DropdownFilterProps) => {
    const [options, setOptions] = useState<any[]>([])
	
    useEffect(()=>{
        var url = tsURL+"api/rest/2.0/searchdata"
		if (setLoading) setLoading(true)
		
        fetch(url,
        {
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            method:'POST',
            credentials: 'include',
            body: JSON.stringify({
                "logical_table_identifier": "5038aaef-031a-4c4e-a442-84b5ade2a218",
                "query_string":"["+field+"] ["+fieldId+"] sort by ["+field+"] ["+field+"] != '-1 N/A' [" + field + "] != '15 UNITED' [" + field + "] != '45 SUPPLY' [" + field + "] != '35 EASTERN' [" + field + "] not contains 'delete'", //Division 45 supply, 15 denver, 35 eastern. Generally DELETE
				
                "data_format": "COMPACT",
                "record_offset": 0,
                "runtime_filter":runtimeFilters,
                "record_size": 10000,
            })
        }).then(response => response.json()).then(data => {
            let filterData = data.contents[0].data_rows;
            var optionsCopy: any[] = []
            for (var dataRow of filterData){
                optionsCopy.push(dataRow);
            }
            setOptions(optionsCopy)
			if (setLoading) setLoading(false)
			// Alert at the end with the query string directly constructed within the alert call
            //alert("Query String: [" + field + "] [" + fieldId + "] sort by [" + field + "] [" + field + "] != '-1 N/A' [" + field + "] != '15 UNITED'");
        })
    },[])
	
/*useEffect(() => {
    // Construct the full API URL
    const url = tsURL + "api/rest/2.0/searchdata";  // Adjust the path as necessary

    console.log('Fetching data for:', field, 'with filters:', runtimeFilters);

    // Make the API request
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
            // Add your request body here
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data received for', field, ':', data);
        // Process the data as needed
    })
    .catch(error => {
        console.error('Error fetching data for', field, ':', error);
    });
}, [tsURL, field, runtimeFilters]); // Ensure all dependencies are listed to track their changes

*/
	
    return (
        <select disabled={locked} className={height + " text-gray-800"} style={{width:"100%"}} onChange={(e) => {
            if (multiple){
                let filterVals = Array.from(e.target.selectedOptions).map((option) => {return option.value})
                if (filterVals.includes("ALL")){
                    setFilter(['ALL'])
                }else{
                    setFilter(filterVals)
                }
            }else{
                if (e.target.value == 'ALL'){
                    setFilter(['ALL'])
                }else{
                    setFilter([e.target.value])
                }
            }
            }} multiple={multiple}>
                {fieldId !== FieldID.DIVISION && <option selected={value.length === 0 || value[0] === 'NONE'} value="NONE">NONE</option>}
        
            <option value={"ALL"}>ALL {fieldLabel}</option>

            {options.map((option)=>{
                return <option selected={option && option[1] ? 
                    value.includes(option[1].toString()) : false
                } value={option[1]}>{fieldId == FieldID.UPC ? 
                    //option[1] + " " + option[0]
					option[0]
                    :
                    option[0]
                    }</option>
            })}
        </select>
    )
} 

