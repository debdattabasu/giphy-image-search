import React, {useState, useRef } from "react"; 
import './App.css'


type ImageProps = {
    src: string; 
    text: string;
    position: string;
    key?: React.Key;
}

function Image(props: ImageProps) {
    return (
        <div className="image-container-outer">
            <div className="image-container" style={{backgroundImage: `url(${props.src})`}}>
                {(props.position == "bottom")?<div style={{flexGrow: 1}}/>: null}
                {(props.position == "top" || props.position == "bottom")?<p>{props.text}</p>: null}
            </div> 
            {(props.position == "below")?<p>{props.text}</p>: null}
        </div>
    )
}


export default function App() {
    const [query, setQuery] = useState(""); 
    const [placementText, setPlacementText] = useState(""); 
    const [placementLocation, setPlacementLocation] = useState("top"); 
    const [queryResponse, setQueryResponse] = useState({});
    const page = useRef(0);

    const data = queryResponse.data == null? []:  queryResponse.data;



    const handleSearch = async ()=> {
        console.log(query, placementText, placementLocation, page.current);
        const url = `https://api.giphy.com/v1/stickers/search?q=${query}&limit=3&offset=${page.current}&rating=g&api_key=1bkG7ky5cmw5SLyvNfElcR1iYVzs38Zq`;  
        const result = await fetch(url);
        const json = await result.json(); 
        setQueryResponse(json);
        console.log(json);
    }

    const handlePrev = ()=> {
        var newPage = Math.max(page.current - 1, 0);
        if(newPage != page.current) {
            page.current = newPage;
            handleSearch();
        }
        
    }

    const handleNext = ()=> {
        var newPage = page.current + 1;
        page.current = newPage;
        handleSearch();
    }

    const setQuerySting = (e) => {
        setQuery(e.target.value); 
        page.current = 0;
    }

    return (
        <div>
        <div className="row row-top">
            <div className=".input-container">
                <p>Search Query</p>
                <input type="text" style={{width: "384px"}} value={query} onChange={setQuerySting}/>
            </div>
            
            <div className=".input-container">
                <p>Text to place</p>
                <input type="text" value={placementText}  onChange={e => setPlacementText(e.target.value)} />
            </div>


            <div className=".input-container">
                <p>Placement Location</p>
                <select value={placementLocation} onChange={e => setPlacementLocation(e.target.value)}>
                    <option value="top">Image Top</option>
                    <option value="bottom">Image Bottom</option>
                    <option value="below">Below Image</option>
                </select>
            </div>



            <button onClick={handleSearch}> Search </button>
            
           
        </div>
        <div className="section-images">
           {data.map((item, index)=> <Image src={item.images.downsized_medium.url} text={placementText} key={index} position={placementLocation}/>)}
        </div>

        <div className="section-buttons">
            <button onClick={handlePrev}> Previous </button>
            <button onClick={handleNext}> Next </button>
        </div>
        
        </div>
    )
}