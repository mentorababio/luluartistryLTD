import About from "@/components/about/About";
import Mission from "@/components/about/Mission";
import Waitlist from "@/components/Waitlist";
import MapSection from "@/components/common/MapSection";

const page = () => {
	return (
		<div>
			<About />
			<Mission />
			<Waitlist />
			<MapSection />
		</div>
	);
};
export default page;
