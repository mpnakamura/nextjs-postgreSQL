import {pool} from "../../../utils/dbConnect"
import dbConnect from "../../../utils/dbConnect";
import { redirect } from "next/navigation";

export default async function edit({params}){
  dbConnect();
  const id = params.id;
  const data = await pool.query("SELECT * FROM notes WHERE id = $1", [id]);
  const result = data.rows[0];


  async function updateNote(data: any) {
    "use server";
    let note = data.get("note")?.valueOf();
    let date = data.get("date")?.valueOf();
    try {
      const updatedNote = await pool.query(
        "UPDATE notes SET note = $1, date = $2 WHERE id = $3",
        [note, date, id]
      );
      console.log("ノートをアップデート",updatedNote);
    } catch (err) {
      console.error(err);
    }
    redirect("/");
  }

  return(
    <main className="m-10">
    <div className="m-5">
      <h1 className="text-center m-5">Add note</h1>
      <form action={updateNote} className="space-y-5">
        <input
          type="text"
          id="note"
          name="note"
          placeholder="Add note"
          defaultValue={result.note}
          className="shadow-lg rounded-md shadow-black h-10 p-3 w-full"
        />
        <input
          type="date"
          id="date"
          name="date"
          placeholder="Add note"
          defaultValue={result.data}
          className="shadow-lg rounded-md shadow-black h-10 p-3 w-full"
        />
        <button
          type="submit"
          className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md"
        >
          SUBMIT
        </button>
      </form>
    </div>
  
  </main>
  )
}