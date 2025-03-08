import React from "react";
// Import the format function from date-fns
import { format } from "date-fns";

interface date {
    text: string;
}

const DateConvert: React.FC<date> = ({ text }) => {
    const dateObj = new Date(text);

    const formattedDate = format(dateObj, "MMMM do, yyyy");
    return <p>{formattedDate}</p>;
};

export default DateConvert;