
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button } from "@material-ui/core";


require("dotenv").config({path: "D:/Tarun/Mern stack/Mini/client/client/.env"});
function BlockCard({ repo, matchingPercentage }) {
console.log(`matching Perccentage is `,matchingPercentage)
console.log(`repos is `,repo)
  const navigate = useNavigate();
  return (
    <Card
    style={{
      width: "100%",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: 8,
      overflow: "hidden",
    }}
  >
    <CardContent style={{ display: "flex", alignItems: "center" }}>
      <Typography style={{ flex: 1, padding: "2px" }}>
        Component: {repo.component}
      </Typography>
      <Typography style={{ flex: 1, padding: "2px" }}>
        Created in: {repo.date}
      </Typography>
      <Typography style={{ flex: 1, padding: "2px" }}>
        Matching Percentage is : {matchingPercentage}%
      </Typography>
      <Button
        style={{
          backgroundColor: "#3f51b5",
          color: "white",
          padding: "8px 16px",
          marginLeft: "auto",
        }}
        onClick={(e) => {
          e.preventDefault();
          // navigate(`/blockDetails/${repo.id}`);
          window.open(`http://localhost:3001/blockDetails/${repo.id}`, "_blank");
          
        }}
      >
        See Details
      </Button>
    </CardContent>
  </Card>
  );
}

export default BlockCard;
