import React, { ReactNode } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface AccordionSectionProps {
  title: string;
  children: ReactNode;
  expanded: boolean;
  setExpanded: (event: React.SyntheticEvent, isExpanded: boolean) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, children, expanded, setExpanded }) => {
  return (
    <Accordion expanded={expanded} onChange={setExpanded}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id={`${title}-header`}>
        <Typography variant="h6">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionSection;
