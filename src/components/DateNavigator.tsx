import React from 'react';
import { format, addDays, subDays, parseISO, isToday, isTomorrow, isYesterday } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './DateNavigator.css';

interface DateNavigatorProps {
    selectedDate: string;
    onSelectDate: (date: string) => void;
}

const DateNavigator: React.FC<DateNavigatorProps> = ({ selectedDate, onSelectDate }) => {
    const dateObj = parseISO(selectedDate);

    const handlePrev = () => {
        onSelectDate(format(subDays(dateObj, 1), 'yyyy-MM-dd'));
    };

    const handleNext = () => {
        onSelectDate(format(addDays(dateObj, 1), 'yyyy-MM-dd'));
    };

    const getDateLabel = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'EEEE, MMM do');
    };

    return (
        <div className="date-navigator-container">
            <div className="date-navigator-controls">
                <button onClick={handlePrev} className="nav-btn" aria-label="Previous Day">
                    <ChevronLeft size={24} />
                </button>

                <div className="current-date-display">
                    <span className="date-label">{getDateLabel(dateObj)}</span>
                </div>

                <button onClick={handleNext} className="nav-btn" aria-label="Next Day">
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default DateNavigator;
