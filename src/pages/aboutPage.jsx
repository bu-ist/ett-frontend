import { Heading } from "@chakra-ui/react";

import DescriptionParagraph from "../components/sharedTexts/home-about/descriptionParagraph";
import DescriptionDetails from '../components/sharedTexts/home-about/descriptionDetails';
import DownloadBlankForms from "../components/sharedTexts/home-about/downloadBlankForms";

export default function AboutPage() {
    return (
        <>
            <Heading as="h2" my={4}>About This Site</Heading>
            <DescriptionParagraph />
            <DescriptionDetails />
            <DownloadBlankForms />
        </>
    );
}
