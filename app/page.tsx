import { pool } from "../utils/dbConnect";
import dbConnect from "../utils/dbConnect";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  dbConnect();

  // Create
  async function createNote(data: any) {
    "use server";
    let note = data.get("note")?.valueOf();
    let date = data.get("date")?.valueOf();
    try {
      const newNote = await pool.query(
        "INSERT INTO notes (note,date) VALUES ($1,$2) RETURNING *",
        [note, date]
      );
      console.log(newNote.rows[0]);
    } catch (err) {
      console.error(err);
    }
    redirect("/");
  }

  //read
  const data = await pool.query("SELECT * FROM notes");
  const result = data.rows;

  //delete
  async function deleteNote(data: any) {
    "use server";
    let id = data.get("id")?.valueOf();
    try {
      const deleteNote = await pool.query("DELETE FROM notes WHERE id = $1", [
        id,
      ]);
      console.log(deleteNote.rows[0]);
    } catch (err) {
      console.error(err);
    }
    redirect("/");
  }

  return (
    <main className="m-10">
      <div className="m-5">
        <h1 className="text-center m-5 font-bold text-3xl">ToDo </h1>
        <form action={createNote} className="space-y-5">
          <input
            type="text"
            id="note"
            name="note"
            placeholder="Todo "
            className="shadow-lg rounded-md shadow-black h-10 p-3 w-full"
          />
          <input
            type="date"
            id="date"
            name="date"
            className="shadow-lg rounded-md shadow-black h-10 p-3 w-full"
          />
          <button
            type="submit"
            className="bg-orange-500 font-bold text-white hover:bg-red-600 p-3 rounded-md"
          >
            SUBMIT
          </button>
        </form>
        <div className="text-center text-2xl font-bold">リスト</div>
      </div>
      {result.map((element) => {
        return (
          <>
         <div className="border-2 border-sky-500 mb-1 rounded-lg shadow" key={element.id}>
  <ul className="flex flex-wrap md:flex-nowrap my-2">
    <li className="text-center w-full md:w-[50%] p-2">{element.note}</li>
    <li className="text-center w-full md:w-[30%] p-2">{element.date}</li>
    <li className="text-center w-full md:w-[20%] flex justify-evenly items-center p-2">
                <Link href={"/edit/" + element.id}>
                  <button className="bg-cyan-600 font-bold text-white p-2 rounded hover:bg-cyan-700 transition duration-300 ease-in-out cursor-pointer ">
                    EDIT
                  </button>
                </Link>
                <form action={deleteNote}>
                  <input type="hidden" name="id" value={element.id} />
                  <button className="bg-red-600 font-bold text-white p-2 rounded hover:bg-red-700 transition duration-300 ease-in-out cursor-pointer" type="submit">
                    DEL
                  </button>
                </form>
              </li>
            </ul>
          </div>
          </>
        );
      })}
</main>
  )
    }