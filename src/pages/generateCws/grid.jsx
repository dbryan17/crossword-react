export default function Grid({ height, width }) {
  return (
    <div>
      <table className="table is-bordered">
        <tbody>
          {Array.from({ length: height }, (_, i) => i).map((_, rowIdx) => {
            return (
              <tr id={"row" + rowIdx} key={"row" + rowIdx}>
                {Array.from({ length: width }, (_, i) => i).map((_, colIdx) => {
                  return (
                    <td
                      id={"cell" + rowIdx + colIdx}
                      key={"cell" + rowIdx + colIdx}
                    >
                      {/* <div className="cellTextCont"> */}
                      <input
                        type="text"
                        maxLength="1"
                        autoComplete="off"
                        className="cellInput input"
                        id={"cellInput" + rowIdx + colIdx}
                      ></input>
                      {/* </div> */}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
