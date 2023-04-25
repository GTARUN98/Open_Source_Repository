
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@material-ui/core";


require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});
function BlockCard({ repo, matchingPercentage }) {
console.log(`matching Perccentage is `,matchingPercentage)
console.log(`repos is `,repo)
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent style={{display:"flex"}}>
            <Typography>Component: {repo.component}</Typography>
            <Typography style={{  marginLeft:"900px"}}>
              Created in: {repo.date}
            </Typography>
            <Typography style={{  marginLeft:""}}>
              Matching Percentage is : {matchingPercentage}%
            </Typography>
          </CardContent>

      <CardContent>
            <Button
              style={{
                backgroundColor: "#3f51b5",
                color: "white"
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/blockDetails/${repo.id}`);
              }}
            >
              See Details
            </Button>
          </CardContent>
    </Card>
  );
}

export default BlockCard;
