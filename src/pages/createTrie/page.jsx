import Header from "../../components/header/header";
import "../../index.css";
import Papa from "papaparse";
import { useRef, useState } from "react";

/*

Todo - 
0) https://bulma.io/documentation/form/file/
1) re upload button where you can do no headers, or select if it has headers or not, probably want to have an upload button 
2) make button group compoenet or to make it so they are highlighted when selected
*/

export default function ChangeDictionaryPage() {
  const [csvData, setCsvData] = useState({
    rowCount: null,
    headers: null,
    data: null,
    errros: null,
  });

  const [selectedHeaderIdx, setSelectedHeaderIdx] = useState(null);

  const addInputToDictionaries = () => {
    let headerIdx = 0;
    if (selectedHeaderIdx) {
      headerIdx = selectedHeaderIdx;
    }
  };

  const handleCsvUpload = (event) => {
    setSelectedHeaderIdx(null);
    // console.log(event.target.files);
    Papa.parse(event.target.files[0], {
      worker: true,
      header: true,
      complete: function (results) {
        console.log(results);
        setCsvData({
          rowCount: results.data.length,
          headers: results.meta.fields,
          data: results.data,
          erros: results.errors,
        });
      },
    });
  };

  console.log(selectedHeaderIdx);

  const fileInputRef = useRef(null);
  return (
    <div className="pageContainer">
      <Header
        title="Change Dictionary"
        subtitle="
      Select eixisting dictionaries to use in order to create a data
      strucutre for the alogirithm. You can also type in additional words,
      or add your own csv file."
      />
      <div>
        <h1 className="is-size-4">Add Dictionaries</h1>
        <input type="file" accept=".csv" onChange={handleCsvUpload}></input>
        <div>
          {csvData.data ? (
            <>
              <div>
                <div>
                  Succesfully uploaded. Dictionary contains {csvData.rowCount}{" "}
                  words
                </div>
                {csvData.headers.length > 1 ? (
                  <div className="headerSelectContainer">
                    <div>
                      multiple headers found choose one to use for the words :
                    </div>
                    {csvData.headers.map((header, idx) => (
                      <>
                        <button
                          className="button is-small wrap-text"
                          onClick={() => setSelectedHeaderIdx(idx)}
                        >
                          {header}
                        </button>{" "}
                        <br />
                      </>
                    ))}
                  </div>
                ) : (
                  ""
                )}
                {(csvData.data && csvData.headers.length === 1) ||
                selectedHeaderIdx !== null ? (
                  <button className="button" onClick={addInputToDictionaries}>
                    Add to dictionaries
                  </button>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        {/* <button class="button" onClick={() => handleCsvUpload}>
          Upload
        </button> */}
        {/* <input type="text" id="searchInput" placeholder="Search..."></input> */}
      </div>
    </div>
  );
}
