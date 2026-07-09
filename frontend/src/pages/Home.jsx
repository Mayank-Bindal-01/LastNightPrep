// import { Link } from "react-router-dom";
// import Branches from "../data/Branches";


// function Home() {


//   return (

//     <div className="home-page">


//       <section className="hero">

//         <div className="overlay">


//           <h1>
//             Study Hub
//           </h1>


//           <p>
//             Search subject notes, PYQs, assignments and syllabus
//           </p>



//           <Link to="/search">

//             <button className="search-btn">

//               Search Subjects

//             </button>

//           </Link>



//         </div>


//       </section>





//       <section className="branches-section">


//         <h2>
//           Browse Syllabus by Branch
//         </h2>



//         <p className="branches-text">

//           Select your branch to view uploaded syllabus PDFs for 1st to 4th year.

//         </p>





//         <div className="branch-container">


//           {
//             Branches.map((branch)=>(


//               <Link

//                 key={branch.id}

//                 to={`/branch/${branch.short}`}

//                 className="card-link"

//               >


//                 <div className="branch-card">


//                   <h3>
//                     {branch.short}
//                   </h3>


//                   <p>
//                     {branch.name}
//                   </p>



//                 </div>


//               </Link>


//             ))
//           }



//         </div>



//       </section>



//     </div>

//   );


// }


// export default Home;


import { useState } from "react";
import { Link } from "react-router-dom";
import Branches from "../data/Branches";
import subjectsData from "../data/subjects";


function Home() {

  const [search, setSearch] = useState("");


  const filteredSubjects = subjectsData.filter((subject) =>

    subject.name.toLowerCase().includes(search.toLowerCase()) ||
    subject.branch.toLowerCase().includes(search.toLowerCase())

  );


  return (

    <div className="home-page">


      {/* HERO */}

      <section className="hero">


        <div className="overlay">


          <h1>
            Study Hub
          </h1>


          <p>
            Search subject notes, PYQs, assignments and syllabus
          </p>



          {/* SEARCH */}

          <div className="study-search-section">


            <div className="study-search-form">


              <input

                type="text"

                placeholder="Search subject name or branch"

                value={search}

                onChange={(e)=>setSearch(e.target.value)}

              />


              <button>
                Search
              </button>


            </div>


          </div>





          {/* RESULTS */}


          {
            search && (

              <div className="study-search-result">


                {
                  filteredSubjects.length > 0 ?


                  filteredSubjects.slice(0,5).map((subject)=>(


                    <Link

                    key={subject.id}

                    to={`/subject/${subject.branch}/${subject.semester}/${encodeURIComponent(subject.name)}`}

                    className="result-link"

                    >


                    <div className="study-result-card">


                      <h3>
                        {subject.name}
                      </h3>


                      <p>
                        {subject.branch} | Semester {subject.semester}
                      </p>


                    </div>


                    </Link>


                  ))


                  :


                  <div className="study-result-card">

                    <p>
                      No Subject Found
                    </p>

                  </div>


                }


              </div>


            )
          }



        </div>


      </section>





      {/* BRANCHES */}


      <section className="branches-section">


        <h2>
          Browse Syllabus by Branch
        </h2>


        <p className="branches-text">

          Select your branch to view uploaded syllabus PDFs for 1st to 4th year.

        </p>




        <div className="branch-container">


        {
          Branches.map((branch)=>(


            <Link

            key={branch.id}

            to={`/branch/${branch.short}`}

            className="card-link"

            >


            <div className="branch-card">


              <h3>
                {branch.short}
              </h3>


              <p>
                {branch.name}
              </p>


            </div>


            </Link>


          ))
        }


        </div>


      </section>



    </div>

  );

}


export default Home;