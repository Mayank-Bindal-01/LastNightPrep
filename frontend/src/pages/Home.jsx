import Hero from "../components/Hero";
import BranchCard from "../components/BranchCard";
import Branches from "../data/Branches";

function Home(){
    return (
       <div>
        <Hero />
        <h2 className="branch-heading">
            Choose Your Branch
        </h2>
       
        <div className="branch-container">{Branches.map((branch)=>(
            <BranchCard key={branch.id}
            branch={branch}  /> 
        ))} </div>
       </div>
    );
}

export default Home;