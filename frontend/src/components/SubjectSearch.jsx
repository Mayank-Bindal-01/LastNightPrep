import { useState } from "react";
import subjects from "../data/subjects";


function SubjectSearch() {

  console.log("FUNCTION RUNNING");
  console.log("All Subjects:", subjects);


  const [searchText, setSearchText] = useState("");
  const [searched, setSearched] = useState(false);


  const normalizedSearch = searchText.trim().toLowerCase();



  // Duplicate subjects remove
  const uniqueSubjects = subjects.filter((subject, index, self) => {

    return (
      index ===
      self.findIndex(
        (s) =>
          s.name?.toLowerCase() ===
          subject.name?.toLowerCase()
      )
    );

  });



  // Search
  const matchedSubjects = normalizedSearch === ""
    ? []
    : uniqueSubjects.filter((subject)=>{


        const name =
          subject.name?.toLowerCase() || "";


        const code =
          subject.code?.toLowerCase() || "";



        return (
          name.includes(normalizedSearch) ||
          code.includes(normalizedSearch)
        );


    });




  function handleSearch(e){

    e.preventDefault();

    setSearched(true);

  }





  return (

    <div className="max-w-5xl mx-auto p-6">


      <h1 className="text-3xl font-bold mb-5">
        Search Subjects
      </h1>



      <form
        onSubmit={handleSearch}
        className="flex gap-3 mb-6"
      >

        <input

          type="text"

          placeholder="Search subject name or code"

          value={searchText}

          onChange={(e)=>{

            setSearchText(e.target.value);
            setSearched(false);

          }}

          className="border p-3 rounded-lg w-full"

        />


        <button

          type="submit"

          className="bg-blue-600 text-white px-6 rounded-lg"

        >
          Search
        </button>


      </form>






      {
        searched &&
        normalizedSearch !== "" &&
        matchedSubjects.length === 0 && (

          <div className="bg-red-100 p-4 rounded">

            <h2 className="text-xl font-bold text-red-600">
              Subject Not Found
            </h2>

          </div>

        )
      }





      {
        searched &&
        matchedSubjects.map((subject)=>(


          <div

            key={subject.id}

            className="border rounded-xl p-5 mb-5 shadow"

          >


            <h2 className="text-2xl font-bold">
              {subject.name}
            </h2>


            <p>
              Branch: {subject.branch}
            </p>


            <p>
              Semester: {subject.semester}
            </p>


            <p>
              Code: {subject.code || "N/A"}
            </p>



            <hr className="my-4"/>




            <h3 className="font-bold">
              Syllabus
            </h3>


            {
              subject.syllabus &&
              subject.syllabus !== "link"

              ?

              <a
                href={subject.syllabus}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 underline"
              >
                View Syllabus
              </a>

              :

              <p>
                Not uploaded
              </p>

            }





            <h3 className="font-bold mt-4">
              Notes
            </h3>


            {
              subject.notes?.length > 0

              ?

              subject.notes.map((note)=>(

                <p key={note.unit}>

                  Unit {note.unit}

                  {" "}

                  <a
                    href={note.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    Download
                  </a>


                </p>

              ))

              :

              <p>
                No Notes
              </p>

            }





            <h3 className="font-bold mt-4">
              PYQ
            </h3>


            {
              subject.pyqs?.length > 0

              ?

              subject.pyqs.map((pyq)=>(

                <p key={pyq.year}>

                  {pyq.year}

                  {" "}

                  <a
                    href={pyq.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    View
                  </a>

                </p>

              ))

              :

              <p>
                No PYQ
              </p>

            }




          </div>


        ))
      }



    </div>

  );

}


export default SubjectSearch;




