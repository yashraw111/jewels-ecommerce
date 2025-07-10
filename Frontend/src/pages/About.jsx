import CommitmentBoxes from "../components/CommitmentBoxes";
import Container from "../components/Container";
import OurStory from "../components/OurStory";
import OurVision from "../components/OurVision";

const About = () => {
  return (
    <div className="px-6 py-10">
      <Container>
        <h2 className="text-2xl font-bold mb-2">About Us</h2>
        <p className="text-sm text-gray-500 mb-6">Home / About</p>

        <OurStory />
        <CommitmentBoxes />
        <OurVision />
      </Container>
    </div>
  );
};

export default About;
