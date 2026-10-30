import SectionOne from "@/components/section-one/SectionOne";
import SectionTwo from "@/components/section-two/SectionTwo";
import SectionThree from "@/components/section-three/SectionThree";
import SectionFour from "@/components/section-four/SectionFour";
import HomeIntro from "@/components/bands/HomeIntro";
import StoryPhotos from "@/components/bands/StoryPhotos";
import CommunityDining from "@/components/bands/CommunityDining";
import RoomsBand from "@/components/bands/RoomsBand";
import ButterflyLayer from "@/components/butterfly/ButterflyLayer";

export default function Home() {
  // Chapters One, Two, Three and Four — the butterfly is ONE continuous
  // character, hosted by ButterflyLayer for the whole experience. In the
  // final chapter it finds its home and quietly stays.
  //
  // Between the chapters sit the four editorial bands that carry the real
  // property photography. Each one is a registered scroll stop, so the site's
  // one-gesture rhythm glides to it instead of jumping over it.
  return (
    <>
      <SectionOne />
      <HomeIntro />
      <SectionTwo />
      <StoryPhotos />
      <SectionThree />
      <CommunityDining />
      <RoomsBand />
      <SectionFour />
      <ButterflyLayer />
    </>
  );
}
