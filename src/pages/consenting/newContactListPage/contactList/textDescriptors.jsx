import { Text } from "@chakra-ui/react";

/* Text Descriptors for the "both" constraint */
export function BothEmployersText() {
    return (
        <Text mb="6">
            List your <b>current and former employers</b> for the period specified by the ETT-Registered Entity that requested this 
            Exhibit Form (“Registered Entity”) and is considering you for a Privilege or Honor, Employment or Role at this time.  
            List up to date contacts of the type (e.g., HR, supervisor, department head) specified by that Registered Entity. 
        </Text>
    );
}

export function BothOtherOrgsText() {
    return (
        <Text mb="6">
            List the organizations where you <b>currently have</b> or <b>formerly had</b> emeritus/emerita, visiting, or other teaching, research, or 
            administrative appointments (same period and type of contact as under 1 above).
        </Text>
    );
}

/* Academic orgs are the same for both "both" and "other" constraints */
export function AcademicText() {
    return (
        <Text mb="6">
            List your <b>current and former</b> academic, professional, and field-related honorary and membership societies and organizations, 
            as well as organizations from which you have received an honor or award (same look-back period as for employers).  
            Contact should be the Executive Director/CEO.
        </Text>
    );
}

/* Text Descriptors for the "other" or constraint, which is for prior employers and other orgs */
export function PriorEmployerText() {
    return (
        <Text mb="6">
            List your <b>former employers</b> for the period specified by the ETT-Registered Entity that requested this Exhibit Form 
            (“Registered Entity”) and is considering you for a Privilege or Honor, Employment or Role at this time.   List up to date 
            contacts of the type (e.g., HR, supervisor, department head) specified by that Registered Entity. 
        </Text>
    );
}

export function PriorOtherOrgsText() {
    return (
        <Text mb="6">
            List the organizations where you <b>formerly</b> had — <b>but no longer have</b> — emeritus/emerita, visiting, or other teaching, research, 
            or administrative appointments (same period and type of contact as employers).
        </Text>
    );
}