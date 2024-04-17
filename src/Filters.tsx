import { useEffect, useRef, useState } from "react"
import { DropdownFilter } from "./DropdownFilter"
import {
    RuntimeFilterOp,
    SearchEmbed,
    useEmbedRef
  } from "@thoughtspot/visual-embed-sdk/lib/src/react";
  import { HiBan, HiMinusCircle, HiPencil, HiPlay, HiPlusCircle } from "react-icons/hi";
  import { HiCalendar, HiFunnel, HiMiniPlay } from "react-icons/hi2";
  import { HiOutlineDocumentReport } from 'react-icons/hi'; // Import the icon from react-icons

import omniGoldImage from './omni gold.png';
  import {DateRangePicker} from "react-date-range"
  import 'react-date-range/dist/styles.css'; // main style file
  import 'react-date-range/dist/theme/default.css'; // theme css file
import DateRangeFilter from "./DateFilter";
import {FieldName, FieldLabel, GroupFields, CategoryFields, UPCFields, FieldID, StoreFields, DivisionFields, DistrictFields} from "./DataDefinitions"
import MyReports from "./MyReports";
import Swal from 'sweetalert2';
interface FilterProps{
    tsURL: string,
}



export const Filters: React.FC<FilterProps> = ({tsURL}:FilterProps) => {
    const [calendarWeek, setCalendarWeek] = useState('fiscal')
    const [timeFrame,setTimeFrame] = useState('last week')
    const [manualDateRange, setManualDateRange] = useState<any>(null)
    const [usingManualDates, setUsingManualDates] = useState(false)
    const [division, setDivision] = useState<string[]>([])
    const [district, setDistrict] = useState<string[]>([])
    const [category, setCategory] = useState<string[]>([])
    const [store, setStore] = useState<string[]>([])
    const [group, setGroup] = useState<string[]>([])
    const [upc, setUpc] = useState<string[]>([])

    const [groupRollup, setGroupRollup] = useState(false);
    const [storeRollup, setStoreRoleup] = useState(false);
    const [categoryRollup, setCategoryRollup] = useState(false);
    const [districtRollup, setDistrictRollup] = useState(false);
    const [divisionRollup, setDivisionRollup] = useState(false);
    const [upcRollup, setUpcRollup] = useState(false);

    const [groupExclude,setGroupExclude] = useState(false);
    const [storeExclude,setStoreExclude] = useState(false);
    const [categoryExclude,setCategoryExclude] = useState(false);
    const [districtExclude,setDistrictExclude] = useState(false);
    const [divisionExclude,setDivisionExclude] = useState(false);
    const [upcExclude,setUpcExclude] = useState(false);

    const [selectedFields, setSelectedFields] = useState<string[]>([])
	const [obNbSelection, setObNbSelection] = useState('OB & NB');

    const [sameStore, setSameStore] = useState(false); 
    const [regStore, setRegStore] = useState(false); 

    const [filtersVisible, setFiltersVisible] = useState(true);
    const [dateRange, setDateRange] = useState<any[]>()

    const filterRef = useRef<HTMLDivElement>(null);

    const [copyPasteProductList, setCopyPasteProductList] = useState<string[] | null>(null)
    const [copyPasteProductListColumn, setCopyPasteProductListColumn] = useState<string | null>(null);
    const [copyPasteLocationList, setCopyPasteLocationList] = useState<string[] | null>(null)
    const [copyPasteLocationListColumn, setCopyPasteLocationListColumn] = useState<string | null>(null);
	
	const [pencilCategoryVisible, setPencilCategoryVisible] = useState(false);
	const [pencilUpcVisible, setPencilUpcVisible] = useState(false);
	const [lockGroup, setLockGroup] = useState(false);
	const [lockCategory, setLockCategory] = useState(false);
	const [whichProductPencil, setWhichProductPencil] = useState('');
	const [categoryLabel, setCategoryLabel] = useState('CHOOSE A CATEGORY');

	const [lockDivision, setLockDivision] = useState(false);
	const [lockDistrict, setLockDistrict] = useState(false);
	const [districtLabel, setDistrictLabel] = useState('CHOOSE '+FieldLabel.DISTRICT);
	const [storeLabel, setStoreLabel] = useState('CHOOSE '+FieldLabel.STORE);
	const [whichLocationPencil, setWhichLocationPencil] = useState('');
	const [pencilDistrictVisible, setPencilDistrictVisible] = useState(false);
	const [pencilStoreVisible, setPencilStoreVisible] = useState(false);

    useEffect(()=>{
        setUsingManualDates(false)
    },[timeFrame, calendarWeek])
	
	
	useEffect(()=>{
			setCategory([])
			setUpc([])
    },[group])

	useEffect(()=>{
			setUpc([])
    },[category])

	useEffect(()=>{
			setDistrict([])
			setStore([])
    },[division])

	useEffect(()=>{
			setStore([])
    },[district])



useEffect(() => {
    console.log('Category changed to:', category);
}, [category]);

 /*   // Logging for debugging
useEffect(() => {
    // Assuming runtimeFilters are built within this component before being passed down
    const upcRuntimeFilters = {
        col1: FieldID.GROUP,
        op1: groupExclude ? "NE" : "IN",
        val1: group,
        col2: FieldID.CATEGORY,
        op2: categoryExclude ? "NE" : "IN",
        val2: category,
        ...(obNbSelection === "OB" && {
            col3: "Manufacture Type Code",
            op3: "EQ",
            val3: ["h"]
        }),
        ...(obNbSelection === "NB" && {
            col3: "Manufacture Type Code",
            op3: "EQ",
            val3: ["n"]
        }),
    };

    console.log('UPC Dropdown runtimeFilters:', upcRuntimeFilters);
}, [group, category, obNbSelection, groupExclude, categoryExclude]); */
   
    function toggleProductCopyPaste(val: string[], field: string){
        if (val.length > 0){
            setCopyPasteProductList(val)
            setCopyPasteProductListColumn(field)
        }else{
            setCopyPasteProductList(null)
            setCopyPasteProductListColumn(null)
        }
    }
    function toggleLocationCopyPaste(val: string[], field: string){
        if (val.length > 0){
            setCopyPasteLocationList(val)
            setCopyPasteLocationListColumn(field)
        }else{
            setCopyPasteLocationList(null)
            setCopyPasteLocationListColumn(null)
        }
    }
    function manualDateChange(val: any){
        setManualDateRange(val)
        setUsingManualDates(true)
    }
    function toggleExpandFilters(expand: boolean){
        if (filterRef && filterRef.current){
          if (!expand){
            filterRef.current.style.display = "none"
          }else{
            filterRef.current.style.display = "flex"
          }
        }
      }
function toggleField(field: string) {
    setSelectedFields(prevFields => {
        if (prevFields.includes(field)) {
            // Return a new array without the field
            return prevFields.filter(f => f !== field);
        } else {
            // Return a new array with the field added
            return [...prevFields, field];
        }
    });
}
    function formatDateString(date: any){
        var month   = date.getUTCMonth() + 1; // months from 1-12
        var day     = date.getUTCDate();
        var year    = date.getUTCFullYear();
        var pMonth        = month.toString().padStart(2,"0");
        var pDay          = day.toString().padStart(2,"0");
        var newPaddedDate = `${pMonth}/${pDay}/${year}`;
        return newPaddedDate;
    }
	
	

	
    function onReportLoad(){
		  if (division.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please make a Division selection',
            footer: '<a href>No Data without a Division</a>'
        });
        return; // Stop further execution if no division is selected
    }
        let searchString = "";
        //Add fields
        let selectedFieldsCopy: string[] = selectedFields;
        // if (groupRollup) selectedFieldsCopy.push(FieldName.GROUP)
        // if (categoryRollup) selectedFieldsCopy.push(FieldName.CATEGORY)
        // if (upcRollup) selectedFieldsCopy.push(FieldName.UPC)
        // if (storeRollup) selectedFieldsCopy.push(FieldName.STORE)
        // if (districtRollup) selectedFieldsCopy.push(FieldName.DISTRICT)
        // if (divisionRollup) selectedFieldsCopy.push(FieldName.DIVISION)
        if (obNbSelection != "OB & NB"){
            if (obNbSelection == "OB"){
                searchString += " [Manufacture Type Code].'h'"
            }else{
                searchString += " [Manufacture Type Code].'n'" 
            }
        }
		
	//console.log("searchString",searchString)	
		
		
        for (var field of selectedFieldsCopy){
            searchString+="["+field+"] "
        }
        //Add filters

        if (copyPasteProductList && copyPasteProductList.length > 0){
            for (var item of copyPasteProductList){
                searchString+= " ["+copyPasteProductListColumn+"].'"+item+"'"
            }
        }
        if (copyPasteLocationList && copyPasteLocationList.length > 0){
            for (var item of copyPasteLocationList){
                searchString+= " ["+copyPasteLocationListColumn+"].'"+item+"'"
            }
        }

        //Add Product Fields
        if (copyPasteProductListColumn == FieldID.CATEGORY ||  (category[0]=='ALL' && !categoryRollup) ||  (category.length > 0 && category[0]!='ALL' && category[0]!='NONE' && !categoryRollup)){
            for (var categoryField of CategoryFields){
                searchString+=" ["+categoryField+"]"
            } 
        }
        if (copyPasteProductListColumn == FieldID.GROUP ||  (group[0]=='ALL' && !groupRollup) ||  (group.length > 0 && group[0]!='ALL' && group[0]!='NONE' && !groupRollup)){
            for (var groupField of GroupFields){
                searchString += " ["+groupField+"]"
            }    
        }
        if (copyPasteProductListColumn == FieldID.UPC ||  (upc[0]=='ALL' && !upcRollup) ||  (upc.length > 0 && upc[0]!='ALL' && upc[0]!='NONE' && !upcRollup)){
            for (var upcField of UPCFields){
                searchString += " ["+upcField+"]"
            }      
        }

        //Add Location Fields
		//console.log("JSON")
      
		if (copyPasteLocationListColumn == FieldID.STORE || (store[0]=='ALL' && !storeRollup) || (store.length > 0 && store[0]!='NONE' && !storeRollup)){
            for (var storeField of StoreFields){
                searchString += " ["+storeField+"]"
            }
        }
        if (copyPasteLocationListColumn == FieldID.DIVISION ||  (division[0]=='ALL' && !divisionRollup) ||  (division.length > 0 && division[0]!='ALL' && division[0]!='NONE' && !divisionRollup)){
            for (var divisionField of DivisionFields){
                searchString += " ["+divisionField+"]"
            }
        }
        if (copyPasteLocationListColumn == FieldID.DISTRICT || (district[0]=='ALL' && !districtRollup) ||  (district.length > 0 && district[0]!='ALL' && district[0]!='NONE' && !districtRollup)){
            for (var districtField of DistrictFields){
                searchString += " ["+districtField+"]"
            }
        }


        //Add Product Filters
        if (!copyPasteProductList){
			
			
			
			if (!lockCategory) {
            if ((category.length > 0 && category[0]!='ALL' && category[0]!='NONE')) {
                if (categoryExclude) searchString+= " ["+FieldID.CATEGORY+"] !="
                for (var value of category){
                    searchString+=" ["+FieldID.CATEGORY +"]."+"'"+value+"'"
                }        
            }
			}
			if (!lockGroup) {
				if ((group.length > 0 && group[0]!='ALL' && group[0]!='NONE'))  {
					if (groupExclude) searchString+= " ["+FieldID.GROUP+ "] !="
					for (var value of group){
						searchString+=" ["+FieldID.GROUP+"]."+"'"+value+"'"
					}
				}
			}
            if ((upc.length > 0 && upc[0]!='ALL' && upc[0]!='NONE'))  {
                if (upcExclude) searchString+= " ["+FieldID.UPC+"] !="
                for (var value of upc){
                    searchString+=" ["+FieldID.UPC+"]."+"'"+value+"'"
                }            
            }
        }

        //Add Store Filters
        if (!copyPasteLocationList){
            if ((store.length > 0 && store[0]!='ALL' && store[0]!='NONE') )  {
                if (storeExclude) searchString+= " ["+FieldID.STORE +"] !="
                for (var value of store){
                    searchString+=" ["+FieldID.STORE+"]."+"'"+value+"'"
                }
            }
			if (!lockDistrict) {
            if ((district.length > 0 && district[0]!='ALL' && district[0]!='NONE'))  {
                if (districtExclude) searchString+= " ["+FieldID.DISTRICT+"] !="
                for (var value of district){
                    searchString+=" ["+FieldID.DISTRICT+"]."+"'"+value+"'"
                }
            }
			}
			if (!lockDivision) {
            if ((division.length > 0 && division[0]!='ALL' && division[0]!='NONE')) {
                if (divisionExclude) searchString+=" ["+FieldID.DIVISION+"] !="
                for (var value of division){
                    searchString+=" ["+FieldID.DIVISION+"]."+"'"+value+"'"
                }
            }
			}
        }

        if (sameStore){
            searchString+= " [Same Store].'true'"
        }
        if (regStore){
            searchString+=" [Conventional Store Flag].'true'"
        }
        
        if (usingManualDates){


            let startDate = formatDateString(manualDateRange.startDate);
            let endDate = formatDateString(manualDateRange.endDate)
            searchString += " [Date] between [Date]."+startDate+" and [Date]."+endDate
        }else{
            if (calendarWeek == "fiscal"){
                searchString += " [Date].'"+timeFrame+"'"
            }else{ 
                searchString += " [Promo Week Filters].'"+timeFrame+"'"
    
            }
        }


        // if (groupRollup){
        //    for (var groupField of GroupFields){}
        //    searchString += '['+groupField+']'
        // }
        // searchString+=" [Week ID]."+"'"+timeFrame+"'"

        const event = new CustomEvent('loadReport', {detail: {data: {
            searchString: searchString}
        }});
        window.dispatchEvent(event)
        toggleExpandFilters(false);
    }


    return (
	

	
        <div className="flex flex-col w-full ">
        <ExpandFilterButton tsURL={tsURL} toggleExpandFilters={toggleExpandFilters}></ExpandFilterButton>
        
        <div ref={filterRef} className="flex flex-row w-full bg-slate-600 p-4 space-x-4" style={{height:'638px'}}>
            <div className="flex flex-col w-1/3 h-full space-y-4">
                <div className="flex flex-col">
                    <div className="text-white text-2xl font-bold">
                        1. TIME FRAME

                    </div>
                    <div className="bg-slate-100 rounded-lg p-4 text-sm custom-shadow">
                        <div className={"flex w-full flex-row font-bold align-center"}>
                             <div className="w-2/3">Time Frame</div>
                             <div className="flex w-1/3 justify-end font-2xl">
                             <DateRangeFilter  usingManualDates={usingManualDates} value={manualDateRange} onChange={manualDateChange} clearDateRange={()=>setUsingManualDates(false)} />
                             </div>
                             
                        </div>
<div className={usingManualDates ? "text-slate-400" : ""} onChange={(e:any) => {
    const newCalendarWeek = e.target.value;
    setCalendarWeek(newCalendarWeek);
    if (newCalendarWeek === "fiscal") {
        setTimeFrame("last week");
        // Update fields related to 'Fiscal Week'
        if (selectedFields.includes("Promo Week ID")) {
            toggleField("Promo Week ID");  // Remove 'Promo Week ID' if it's there
            toggleField("Week ID");  // Add 'Week ID'
        }
    } else {
        setTimeFrame("last promo week");
        // Update fields related to 'Promo Week'
        if (selectedFields.includes("Week ID")) {
            toggleField("Week ID");  // Remove 'Week ID' if it's there
            toggleField("Promo Week ID");  // Add 'Promo Week ID'
        }
    }
}}>
                            <input checked={calendarWeek=="fiscal"}  type="radio" value="fiscal" name="timeframe" /> Fiscal Week
                            <input checked={calendarWeek=="promo"} className="ml-4" type="radio" value="promo" name="timeframe" /> Promo Week
                        </div>
                        {calendarWeek == "fiscal" ?
                        <select className={usingManualDates ? "w-full text-slate-400" : "w-full"}   onChange={(e:any)=>setTimeFrame(e.target.value)}>
                            <option value='last week'>Last Week</option>
                            <option value='this week'>This Week</option>
                            <option value='yesterday'>Yesterday</option>
                            <option value='today'>Today</option>
                            <option value='Last 4 weeks'>Last 4 Weeks</option>
                            <option value='last 12 weeks'>Last 12 Weeks</option>
                            <option value='last 24 weeks'>Last 24 Weeks </option>
                            <option value='last 26 weeks'>Last 26 Weeks</option>
                            <option value='last 52 weeks'>Last 52 Weeks</option>
                            <option value='last quarter'>Last Quarter</option>
                            <option value='last year'>Last Year</option>
                            <option value='this quarter'>This Quarter</option>
                            <option value='year to date'>Year To Date</option>
                        </select>
                        :
                        <select className={usingManualDates ? "w-full text-slate-400" : "w-full"}  onChange={(e:any)=>setTimeFrame(e.target.value)}>
                            <option value='Last Promo Week'>Last Week</option>
                            <option value='Last 4 Promo Weeks'>Last 4 Weeks</option>
                            <option value='Last 12 Promo Weeks'>Last 12 Weeks</option>
                            <option value='Last 24 Promo Weeks'>Last 24 Weeks </option>
                            <option value='Last 26 Promo Weeks'>Last 26 Weeks</option>
                            <option value='Last 52 Promo Weeks'>Last 52 Weeks</option>
                        </select>
                        }

                    </div>
                </div>
                
                <div className="flex flex-col">
                    <div className="text-white text-2xl font-bold">
                        2. LOCATION
                    </div>
                    {(copyPasteLocationList && copyPasteLocationList.length >0) ?
                        <div className="flex flex-col w-full h-full items-center justify-center bg-slate-100 rounded-lg p-4 space-y-4">
                        <div> Manual values entered for: <b>{copyPasteLocationListColumn} </b></div>
                        <div> {copyPasteLocationList.length < 20 ? copyPasteLocationList.join(", ") : copyPasteLocationList.length + " Values"}</div>
                        <button className="bg-gray-400 w-24 h-12 rounded-lg text-white" onClick={() => toggleLocationCopyPaste([],"")}>Clear</button>
                        </div>
                    :
                    <div className="flex flex-col bg-slate-100 rounded-lg p-4 space-y-4 custom-shadow">
                    <div className="flex flex-col text-xs font-bold">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex text-sm justify-start w-3/4">
                            Division
                            <IncludeExcludeButton value={divisionExclude}  setValue={setDivisionExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-3/4">
						    {whichLocationPencil !== '' && whichLocationPencil !== 'division' ?
									<div></div>
							:
                            <CopyPasteButton active={whichProductPencil === 'division'} onSubmit={(val: string[])=>{ 
							  if (val.length) {
								  setWhichLocationPencil('division')
							  } else {
								  // clear
								  setWhichLocationPencil('')
							  }
							  setDivision(val)
							}} field={FieldLabel.DIVISION}></CopyPasteButton>
							}
                            <RollUpButton onChange={() => setDivisionRollup(!divisionRollup)} />
                        </div>
                    </div>
                   
                    <DropdownFilter key={division.toString()} tsURL={tsURL} runtimeFilters={{}} value={division} field={FieldName.DIVISION} fieldId={FieldID.DIVISION} fieldLabel={FieldLabel.DIVISION} setFilter={setDivision} multiple={true} locked={lockDivision} height={"h-28"}></DropdownFilter>
           
                    </div>
                    <div className="flex flex-col text-xs font-bold">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex text-sm justify-start w-3/4">District
                        <IncludeExcludeButton value={districtExclude}  setValue={setDistrictExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-3/4">
							{whichLocationPencil !== '' && whichLocationPencil !== 'district' ?
								<div></div>
							:
								<CopyPasteButton active={whichProductPencil === 'district'} onSubmit={(val: string[])=>{
									if (val.length) {
										setLockDivision(true)
										setLockDistrict(true)
										setWhichLocationPencil('district')
										setDistrictLabel('Pencil selected: ' + val)
										setPencilDistrictVisible(true)
									} else {
										//clear
										setLockDivision(false)
										setLockDistrict(false)
										setWhichLocationPencil('')
										setDistrictLabel('CHOOSE ' + FieldLabel.DISTRICT)
										setPencilDistrictVisible(false)
									}
									setDistrict(val)
								}} field={FieldLabel.DISTRICT}></CopyPasteButton>
							}
                            <RollUpButton onChange={() => setDistrictRollup(!districtRollup)} />
                        </div>
                    </div>
					{pencilDistrictVisible ?
                    <div className="h-24 w-full bg-white flex items-center justify-center">
						{districtLabel}
                    </div>
					:
                    division.length>0 && division[0]!='NONE'?
                    <DropdownFilter key={division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:FieldID.DIVISION,
                        op1:divisionExclude? "NE" : "IN",
                        val1:division
                    }} value={district} field={FieldName.DISTRICT} fieldId={FieldID.DISTRICT} fieldLabel={FieldLabel.DISTRICT} setFilter={setDistrict} multiple={true} locked={lockDistrict} height={"h-24"}></DropdownFilter>
                    :
                    <div className="h-24 w-full bg-white flex items-center justify-center">
						{districtLabel}
                    </div>
					}
                    </div>
                    <div className="flex flex-col text-xs font-bold">
                    <div className="flex flex-row font-bold w-full">
                        <div className="flex justify-start w-1/2 text-sm">Store
                        <IncludeExcludeButton value={storeExclude}  setValue={setStoreExclude}></IncludeExcludeButton>
                        </div>
                        <div className="flex justify-end w-1/2">
							{whichLocationPencil !== '' && whichLocationPencil !== 'store' ?
								<div></div>
							:
								<CopyPasteButton active={whichProductPencil === 'store'} onSubmit={(val: string[])=>{
									if (val.length) {
										setLockDivision(true)
										setLockDistrict(true)
										setWhichLocationPencil('store')
										setDistrictLabel('Using Store Pencil')
										setStoreLabel('Using Store Pencil: ' + val)
										setPencilDistrictVisible(true)
										setPencilStoreVisible(true)
									} else {
										setLockDivision(false)
										setLockDistrict(false)
										setWhichLocationPencil('')
										setDistrictLabel('CHOOSE DISTRICTS')
										setStoreLabel('CHOOSE '+FieldLabel.STORE)
										setPencilDistrictVisible(false)
										setPencilStoreVisible(false)
									}
									setStore(val)
								}} field={FieldLabel.STORE}></CopyPasteButton>
							}
							
                            <RollUpButton onChange={() => setStoreRoleup(!storeRollup)} />
                        </div>
                    </div>
                    {pencilStoreVisible ?
                    <div className="h-24 w-full bg-white flex items-center justify-center">
                        {storeLabel}
                    </div>					
					:
					/*division.length>0 && division[0]!='NONE'&& */ district.length>0 && district[0]!='NONE'  ?
                    <DropdownFilter key={district[0] + division[0]} tsURL={tsURL} runtimeFilters={{
                        col1:FieldID.DISTRICT,
                        op1:districtExclude? "NE" : "IN",
                        val1:district,
                        col2:FieldID.DIVISION,
                        op2:divisionExclude? "NE" : "IN",
                        val2:division
                    }} value={store} field={FieldName.STORE} fieldId={FieldID.STORE} fieldLabel={FieldLabel.STORE} setFilter={setStore} multiple={true}  height={"h-24"}></DropdownFilter>
                    :
                    <div className="h-24 w-full bg-white flex items-center justify-center">
                        {storeLabel}
                    </div>
                    }


                    </div>
                    </div>
                }
                </div>
            </div>
            <div className="flex flex-col w-full h-full">
                <div className="text-white text-2xl font-bold">
                3. PRODUCT HIERARCHY
                </div>
                
                <div className="flex flex-col w-full h-full items-center justify-center bg-slate-100 rounded-lg p-4 custom-shadow">

                <div className="flex flex-row w-full h-full bg-slate-100 rounded-lg space-x-4">
                    <></>
                    <div className="flex flex-col h-full w-5/12 text-lg">
                        <div className="mb-4 text-xs text-custom-bold">
                            <div className="flex flex-row w-full">
                                <div className="flex justify-start w-1/2 text-sm">Group
                                <IncludeExcludeButton value={groupExclude}  setValue={setGroupExclude}></IncludeExcludeButton>
                                </div>
                                <div className="flex justify-end w-1/2">
								
								{whichProductPencil !== '' && whichProductPencil !== 'group' ?
									<div></div>
								:
                                    <CopyPasteButton active={whichProductPencil === 'group'} onSubmit={(val: string[])=>{
										if (val.length) {
											// set
											setWhichProductPencil('group')
										} else {
											// clear
											setWhichProductPencil('')
										}
									setGroup(val)
									}} field={FieldLabel.GROUP}></CopyPasteButton>
								}
                                    <RollUpButton onChange={()=>setGroupRollup(!groupRollup)} />
                                </div>
                            </div>
                            <DropdownFilter key={group.toString()} tsURL={tsURL} runtimeFilters={{}} value={group} fieldId={FieldID.GROUP} fieldLabel={FieldLabel.GROUP} field={FieldName.GROUP} setFilter={setGroup} multiple={true} height={"h-44"} locked={lockGroup}></DropdownFilter>
                        </div>
                        <div className="mb-4 text-xs text-custom-bold">
                            <div className="flex flex-row font-bold w-full">
                                    <div className="flex text-sm justify-start w-1/2">Category
                                    <IncludeExcludeButton value={categoryExclude}  setValue={setCategoryExclude}></IncludeExcludeButton>
                                    </div>
                                    <div className="flex justify-end w-1/2">
										{whichProductPencil !== '' && whichProductPencil !== 'category' ?
											<div></div>
										:
                                        <CopyPasteButton active={whichProductPencil === 'category'} onSubmit={(val: string[])=>{
											if (val.length) {
												setWhichProductPencil('category')
												console.log("val",val)
												setLockGroup(true)
												setCategoryLabel('Pencil selected: ' + val)
												//setGroup([]) // clear group
												//remember to lock groupby box and group by pencil because it's higher in the hierarchy											
												//run query to get category label
												setCategory(val)
												//set state to show our custom control
												setPencilCategoryVisible(true)
											} else {
												setWhichProductPencil('')
												setLockGroup(false)
												setPencilCategoryVisible(false)
												setCategoryLabel('CHOOSE CATEGORY')
											}
										}} field={FieldLabel.CATEGORY}></CopyPasteButton>
										}
                                        <RollUpButton onChange={() => setCategoryRollup(!categoryRollup)} />
                                    </div>
                            </div>
                            {pencilCategoryVisible ? 
							    <div className="h-56 w-full bg-white flex items-center justify-center">
								  {categoryLabel}
								</div>								
							:
							group.length>0 && group[0]!='NONE' ? 
                            <DropdownFilter key={group[0]} tsURL={tsURL} runtimeFilters={{
                                col1:FieldID.GROUP,
                                op1:groupExclude? "NE" : "IN",
                                val1:group,
                            }} value={category} field={FieldName.CATEGORY} fieldId={FieldID.CATEGORY} fieldLabel={FieldLabel.CATEGORY} setFilter={setCategory} multiple={true} locked={lockCategory} height={"h-56"}></DropdownFilter>
                            :
                            <div className="h-56 w-full bg-white flex items-center justify-center">
                            {categoryLabel}
                            </div>
                            }
                            </div>
                    </div>
                    <div className="flex flex-col h-full w-7/12 text-lg">
                        <div className="flex flex-row">
                        <div className="flex flex-col h-full w-9/12">
                            <div className="mb-8 text-xs text-custom-bold">
                                <div className="flex flex-row font-bold w-full">
                                    <div className="flex text-sm justify-start w-1/2">UPC
                                    <IncludeExcludeButton value={upcExclude}  setValue={setUpcExclude}></IncludeExcludeButton>
                                    </div>
                                    <div className="flex justify-end w-1/2">
									    {whichProductPencil !== '' && whichProductPencil !== 'upc' ?
											<div></div>
										:
                                        <CopyPasteButton active={whichProductPencil === 'upc'} onSubmit={(val: string[])=>{
										  if (val.length) {
											  setWhichProductPencil('upc')
											  setLockGroup(true)
											  setLockCategory(true)
											  setCategoryLabel('Using UPC pencil')
											  setPencilCategoryVisible(true)
											  setPencilUpcVisible(true)
											  
										  } else {
											  setWhichProductPencil('')
											  setLockGroup(false)
											  setLockCategory(false)
											  setCategoryLabel('CHOOSE CATEGORY')
											  setPencilUpcVisible(false)
											  setPencilCategoryVisible(false)
										  }
										  setUpc(val)
										  
										}} field={FieldLabel.UPC}></CopyPasteButton>
										}
                                        <RollUpButton onChange={() => setUpcRollup(!upcRollup)} />

                                    </div>
                                </div>
								{ pencilUpcVisible ?
								<div className="h-56 w-full bg-white flex items-center justify-center">
								  {'From pencil box: ' + upc}
								</div>
								:
                                /* group.length>0 && group[0]!='NONE'&& */ category.length>0 && category[0]!='NONE'  ?
                                <DropdownFilter key={group[0]+category[0]+obNbSelection} tsURL={tsURL} runtimeFilters={{
									/*
                                    col1:FieldID.GROUP,
                                    op1:groupExclude ? "NE" : "IN",
                                    val1:group,
									*/
                                    col1:FieldID.CATEGORY,
                                    op1:categoryExclude ? "NE" : "IN" ,
                                    val1:category,
                                    ...(obNbSelection == "OB" && {
                                        col3:"Manufacture Type Code",
                                        op3:"EQ",
                                        val3:["h"]
                                    }),
                                    ...(obNbSelection == "NB" && {
                                        col3:"Manufacture Type Code",
                                        op3:"EQ",
                                        val3:["n"]
                                    })
                                }} value={upc} field={FieldName.UPC} fieldId={FieldID.UPC} fieldLabel={FieldLabel.UPC} setFilter={setUpc} multiple={true} height={"h-108"}></DropdownFilter>
                                :
                                <div className="h-108 w-full bg-white flex items-center justify-center">
                                    {'CHOOSE '+FieldLabel.UPC}
                                </div>
                                }
                            </div>
                        </div>
						
                        <div className="flex flex-col h-full w-3/12 text-xs ml-4 justify-center">
                            <div className="font-bold text-sm">More Fields</div>
                            <div className="mt-2 mb-2 text-xs"> {/* Adjusted margins for compact spacing */}
                                <label className="block">
                                    <input className="mr-2" type="radio" name="obNbSelection" value="OB & NB" checked={obNbSelection === 'OB & NB'} onChange={() => setObNbSelection('OB & NB')} />
                                    OB & NB
                                </label>
                                <label className="block">
                                    <input className="mr-2" type="radio" name="obNbSelection" value="NB" checked={obNbSelection === 'NB'} onChange={() => setObNbSelection('NB')} />
                                    NB Only
                                </label>
                                <label className="block">
                                    <input className="mr-2" type="radio" name="obNbSelection" value="OB" checked={obNbSelection === 'OB'} onChange={() => setObNbSelection('OB')} />
                                    OB Only
                                </label>
                            </div>
                            <hr className="border-t border-gray-300 mb-2" />

                            <div><input className="mr-2" onChange={()=>toggleField("Banner Corporate")} type="checkbox"></input>Corp. Banner</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Banner Store")} type="checkbox"></input>Store Banner</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Vendor Brand")} type="checkbox"></input>Vendor</div>
                            {/* class id + description when class selected */}
                            <div><input className="mr-2" onChange={()=>toggleField("Class")} type="checkbox"></input>Class</div>

                            <div><input className="mr-2" onChange={()=>toggleField("Sub Class")} type="checkbox"></input>Sub Class</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Date")} type="checkbox"></input>Date</div>
							<div><input className="mr-2" type="checkbox" onChange={() => toggleField(calendarWeek === "promo" ? "Promo Week ID" : "Week ID")} checked={selectedFields.includes(calendarWeek === "promo" ? "Promo Week ID" : "Week ID")} />{calendarWeek === "promo" ? "Promo Week ID": "Week ID"}</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Period ID")} type="checkbox"></input>Period ID</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Quarter ID")} type="checkbox"></input>Quarter ID</div>
                            <div><input className="mr-2" onChange={()=>toggleField("CIG")} type="checkbox"></input>CIG</div>
                            <div><input className="mr-2" onChange={()=>toggleField("Vendor Parent")} type="checkbox"></input>Parent Vendor</div>
                            <div><input className="mr-2" onChange={()=>setSameStore(!sameStore)} type="checkbox"></input>Same Store</div>
                            <div><input className="mr-2" onChange={()=>setRegStore(!regStore)} type="checkbox"></input>Reg Stores Only</div>
                        </div>
                    </div>

                    </div>
                </div>
                

                    <div onClick={onReportLoad}  className="flex w-full bg-slate-600 hover:bg-slate-500 align-center items-center p-2 text-white font-bold rounded-lg  hover:cursor-pointer">
                        <span>Load Report</span>
                        <div className="ml-auto flex items-center bg-button-yellow bg-button-yellow hover:bg-yellow-300 rounded-lg px-4 py-1 text-gray-800">
                            <HiMiniPlay className="mr-2" /> {/* Icon next to "GO" */}
                            GO!
                        </div>
                    </div>
      
            </div>
        </div>
        </div>
        </div>

    )
}

interface CopyPasteButtonProps {
    onSubmit: (list: string[])=> void,
	active?: boolean,
    field: string
}
const CopyPasteButton: React.FC<CopyPasteButtonProps> = ({onSubmit, active, field}:CopyPasteButtonProps )=> {
    const [popupVisible, setPopupVisible] = useState(false);
    const [values, setValues] = useState<string>('')

    const ToggleSubmit = () =>{
        setPopupVisible(false);
        onSubmit(values.split(/, ?|\n/))
    }
    const ToggleClear = () => {
        setValues("")
        setPopupVisible(false);
        onSubmit([])

    }
    return (
        <div className="h-full flex items-center mr-3 text-nml">
			{active ? 
				<HiPencil className="text-blue-500 hover:cursor-pointer hover:text-blue-500" onClick={() => setPopupVisible(!popupVisible)}></HiPencil>
			:
				<HiPencil className="text-slate-500 hover:cursor-pointer hover:text-blue-500" onClick={() => setPopupVisible(!popupVisible)}></HiPencil>
			}
            {popupVisible && (
                
            <div className="absolute w-96 flex flex-col shadow-2xl border-1 border-slate-600 bg-slate-200 rounded-lg font-normal p-4 space-y-4">
                <div className="w-full">{field + " - Paste a list of IDs"}</div>
                <textarea className="w-90 h-40 rounded-md" value={values} onChange={(e)=> setValues(e.target.value)}></textarea>
                <div className="bg-slate-600 h-16 w-full items-center justify-center flex space-x-4 rounded-lg">
                <button className="bg-yellow-400 w-24 h-12 rounded-lg text-white " onClick={ToggleSubmit}>Submit</button>
                <button className="bg-gray-400 w-24 h-12 rounded-lg text-white " onClick={ToggleClear}>Clear</button>
                </div>
            </div>
            
            )}
        </div>
    )
}
interface RollUpButtonProps {
    onChange:  () => void,
	className?: string;
}
const RollUpButton: React.FC<RollUpButtonProps> = ({onChange}:RollUpButtonProps )=> {
    return (
        <>
            <input onChange={onChange} type="checkbox"></input>
            <div className="ml-2 font-normal text-xxs">Roll-Up</div>
        </>
    )
}
interface IncludeExcludeButtonProps {
    value: boolean,
    setValue: (val: boolean)=> void;
}
const IncludeExcludeButton: React.FC<IncludeExcludeButtonProps> = ({value, setValue}:IncludeExcludeButtonProps )=> {
    return (
        <div onClick={()=>setValue(!value)} className="ml-2 h-full items-center flex">
            {value ? 
            <div className="text-red-400 hover:text-red-500">
            <HiMinusCircle className="hover:cursor-pointer hover:text-blue-500"></HiMinusCircle> 
            </div>
            : 
            <div className="text-slate-400 hover:text-slate-500">
            <HiPlusCircle className="hover:cursor-pointer hover:text-blue-500"></HiPlusCircle>
            </div>}
        </div>
    )
}
interface ExpandFilterProps {
    tsURL: string,
    toggleExpandFilters: (expand: boolean) => void
}
const ExpandFilterButton: React.FC<ExpandFilterProps> = ({tsURL,toggleExpandFilters}: ExpandFilterProps) => {
    const [filtersVisible, setFiltersVisible] = useState(true);
    
    useEffect(() => {
        function handleLoad(){
            setFiltersVisible(false)
        }
        window.addEventListener("loadReport", handleLoad);
        return () => window.removeEventListener("loadReport", handleLoad);
      }, []);
    function toggleFilters(){
        setFiltersVisible(!filtersVisible)
        toggleExpandFilters(!filtersVisible)
    }
    function collapseFilters(){
        setFiltersVisible(false)
        toggleExpandFilters(false)
    }
    return (
        <div className="flex h-16 bg-slate-200 flex-row m-4 rounded-md">
            <div className="flex w-1/2 items-center justify-start  ">
  <div className="flex w-1/2 items-center justify-start">
    <img src={omniGoldImage} alt="Omni Gold" className="pl-4 pr-8" style={{ height: 'auto', maxWidth: '100%', maxHeight: '150px' }} />
       <div className="flex items-center justify-center hover:cursor-pointer">
          <div className="ml-auto flex items-center bg-button-yellow hover:bg-yellow-300 rounded-lg px-4 py-1">
          <MyReports collapseFilters={collapseFilters} tsURL={tsURL} />
		  </div>
        </div>
      </div>

            </div>

            <div onClick={toggleFilters} className="mr-4 flex w-1/2 items-center justify-end font-bold hover:cursor-pointer hover:text-blue-500 text-2xl">
                {
                filtersVisible ?<><div className="text-sm mr-2">COLLAPSE GOLD</div> <HiFunnel></HiFunnel></>: <><div className="text-sm mr-2">EXPAND GOLD</div><HiFunnel></HiFunnel></>
                }</div>

        </div>
    )
}
