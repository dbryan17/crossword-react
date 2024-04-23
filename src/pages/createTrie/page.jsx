import Header from "../../components/header/header";
import "../../index.css";
export default function ChangeDictionaryPage() {
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
        <input
          type="file"
          accept=".csv"
          onchange="handleFiles(this.files)"
        ></input>
        {/* <input type="text" id="searchInput" placeholder="Search..."></input> */}
        <div id="csvDisplayArea"></div>
      </div>
    </div>
  );
}
