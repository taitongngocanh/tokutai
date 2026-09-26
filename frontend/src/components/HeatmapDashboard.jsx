import { useState, useEffect } from 'react';
import { format, subDays, startOfWeek, endOfWeek, addDays, isSameDay, startOfMonth, endOfMonth, startOfYear, endOfYear, getDaysInMonth, eachDayOfInterval, formatISO, subWeeks, subMonths, subYears, addWeeks, addMonths, addYears, isAfter, isToday } from 'date-fns';
import { goodHabitsAPI, badHabitsAPI } from '../api/api';
import { ChevronLeft, ChevronRight, CalendarDays, Calendar as CalendarIcon, Grid } from 'lucide-react';

export default function HeatmapDashboard({ onDataChange }) {
  const [view, setView] = useState('week'); // 'week', 'month', 'year'
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [goodHabits, setGoodHabits] = useState([]);
  const [badHabits, setBadHabits] = useState([]);
  const [goodCompletions, setGoodCompletions] = useState([]);
  const [badViolations, setBadViolations] = useState([]);
  
  const [loading, setLoading] = useState(false);

  const fetchHeatmapData = async () => {
    setLoading(true);
    try {
      let start, end;
      if (view === 'week') {
        start = startOfWeek(currentDate, { weekStarts: 1 });
        end = endOfWeek(currentDate, { weekStarts: 1 });
      } else if (view === 'month') {
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
      } else {
        start = startOfYear(currentDate);
        end = endOfYear(currentDate);
      }
      
      const startDateStr = formatISO(start, { representation: 'date' });
      const endDateStr = formatISO(end, { representation: 'date' });

      const [ghRes, bhRes, gcRes, bvRes] = await Promise.all([
        goodHabitsAPI.getAll(),
        badHabitsAPI.getAll(),
        goodHabitsAPI.getHistory(startDateStr, endDateStr).catch(() => ({ data: [] })),
        badHabitsAPI.getHistory(startDateStr, endDateStr).catch(() => ({ data: [] }))
      ]);

      setGoodHabits(ghRes.data);
      setBadHabits(bhRes.data);
      setGoodCompletions(gcRes.data || []);
      setBadViolations(bvRes.data || []);
    } catch (error) {
      console.error("Error fetching heatmap data", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHeatmapData();
  }, [view, currentDate]);

  const handlePrev = () => {
    if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    if (view === 'year') setCurrentDate(subYears(currentDate, 1));
  };

  const handleNext = () => {
    if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    if (view === 'year') setCurrentDate(addYears(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const toggleHabit = async (habitId, date) => {
    // Only allow toggling past or today
    if (isAfter(date, new Date()) && !isToday(date)) return;
    
    try {
      await goodHabitsAPI.toggle(habitId, formatISO(date, { representation: 'date' }));
      fetchHeatmapData();
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error("Error toggling habit", error);
    }
  };

  // Build grid days based on view
  let gridDays = [];
  if (view === 'week') {
    const start = startOfWeek(currentDate, { weekStarts: 1 });
    const end = endOfWeek(currentDate, { weekStarts: 1 });
    gridDays = eachDayOfInterval({ start, end });
  } else if (view === 'month') {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    gridDays = eachDayOfInterval({ start, end });
  } else {
    const start = startOfYear(currentDate);
    const end = endOfYear(currentDate);
    gridDays = eachDayOfInterval({ start, end });
  }

  const getCompletionRatio = (date) => {
    if (goodHabits.length === 0) return 0;
    
    const targetDateStr = formatISO(date, { representation: 'date' });
    const completedCount = goodCompletions.filter(c => c.date === targetDateStr).length;
    
    return completedCount / goodHabits.length;
  };

  const hasBadViolation = (date) => {
    const targetDateStr = formatISO(date, { representation: 'date' });
    return badViolations.some(v => v.violatedAt && v.violatedAt.startsWith(targetDateStr));
  };

  const getOverallCellClass = (date) => {
    if (isAfter(date, new Date()) && !isToday(date)) return 'bg-surface-100';
    if (hasBadViolation(date)) return 'bg-red-500';
    
    const ratio = getCompletionRatio(date);
    if (ratio === 0) return 'bg-surface-200';
    if (ratio <= 0.25) return 'bg-brand-100';
    if (ratio <= 0.5) return 'bg-brand-300';
    if (ratio <= 0.75) return 'bg-brand-500';
    return 'bg-brand-700';
  };

  const isHabitCompleted = (habitId, date) => {
    const targetDateStr = formatISO(date, { representation: 'date' });
    return goodCompletions.some(c => c.goodHabit?.id === habitId && c.date === targetDateStr);
  };

  const getHabitCellClass = (habitId, date) => {
    if (isAfter(date, new Date()) && !isToday(date)) return 'bg-surface-50 cursor-not-allowed';
    
    const completed = isHabitCompleted(habitId, date);
    return completed ? 'bg-brand-500 cursor-pointer' : 'bg-surface-200 hover:bg-surface-300 cursor-pointer';
  };

  const getTitle = () => {
    if (view === 'week') return `Week of ${format(startOfWeek(currentDate, { weekStarts: 1 }), 'MMM d, yyyy')}`;
    if (view === 'month') return format(currentDate, 'MMMM yyyy');
    return format(currentDate, 'yyyy');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-surface-200 overflow-hidden mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-surface-200 bg-surface-50 gap-4">
        <h2 className="text-lg font-semibold text-surface-900">Activity Heatmap</h2>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-surface-200 p-1 rounded-lg mr-4">
            <button 
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'week' ? 'bg-white text-brand-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'month' ? 'bg-white text-brand-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('year')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'year' ? 'bg-white text-brand-600 shadow-sm' : 'text-surface-600 hover:text-surface-900'}`}
            >
              Year
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={handlePrev} className="p-2 hover:bg-surface-200 rounded-lg text-surface-600 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-medium text-surface-700 min-w-[120px] text-center">
              {getTitle()}
            </span>
            <button onClick={handleNext} className="p-2 hover:bg-surface-200 rounded-lg text-surface-600 transition-colors">
              <ChevronRight size={20} />
            </button>
            <button onClick={handleToday} className="px-3 py-1.5 ml-2 text-sm font-medium bg-surface-200 hover:bg-surface-300 rounded-lg text-surface-700 transition-colors">
              Today
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center text-surface-500 animate-pulse">
          Loading heatmap...
        </div>
      )}

      {!loading && (
        <div className="p-6 overflow-x-auto">
          {/* Overall Heatmap */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-surface-700 mb-3 flex items-center">
              <Grid size={16} className="mr-2" /> Overall Activity
            </h3>
            
            {view === 'year' ? (
              <div className="flex gap-1">
                {/* Year view requires a special Github-like grid (53 cols x 7 rows). For simplicity, we wrap it in a flex container */}
                <div className="flex flex-wrap gap-1" style={{ maxWidth: '800px' }}>
                  {gridDays.map(date => (
                    <div 
                      key={date.toString()} 
                      title={`${format(date, 'MMM d, yyyy')}: ${(getCompletionRatio(date)*100).toFixed(0)}% completed`}
                      className={`w-3 h-3 rounded-sm ${getOverallCellClass(date)} ${isToday(date) ? 'ring-2 ring-brand-500 ring-offset-1' : ''}`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className={`grid gap-2 ${view === 'week' ? 'grid-cols-7' : 'grid-cols-7 sm:grid-cols-10 md:grid-cols-14 lg:grid-cols-16'}`}>
                {gridDays.map(date => (
                  <div key={date.toString()} className="flex flex-col items-center">
                    <span className="text-xs text-surface-500 mb-1">{format(date, 'd')}</span>
                    <div 
                      title={`${format(date, 'MMM d, yyyy')}: ${(getCompletionRatio(date)*100).toFixed(0)}% completed`}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md ${getOverallCellClass(date)} ${isToday(date) ? 'ring-2 ring-brand-500 ring-offset-2' : ''}`}
                    />
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center justify-end mt-4 text-xs text-surface-500 space-x-2">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-surface-200"></div>
              <div className="w-3 h-3 rounded-sm bg-brand-100"></div>
              <div className="w-3 h-3 rounded-sm bg-brand-300"></div>
              <div className="w-3 h-3 rounded-sm bg-brand-500"></div>
              <div className="w-3 h-3 rounded-sm bg-brand-700"></div>
              <span>More</span>
              <div className="w-3 h-3 rounded-sm bg-red-500 ml-4"></div>
              <span>Bad Habit</span>
            </div>
          </div>

          {/* Habit Tracker Table */}
          {goodHabits.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-surface-700 mb-3 flex items-center">
                <CalendarIcon size={16} className="mr-2" /> Habits Tracking
              </h3>
              
              <div className="border border-surface-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3 font-medium text-sm text-surface-700 bg-surface-50 border-b border-r border-surface-200 sticky left-0 z-10 w-48">Habit</th>
                        {gridDays.map(date => (
                          <th key={date.toString()} className={`p-2 font-medium text-xs text-center text-surface-500 bg-surface-50 border-b border-surface-200 min-w-[32px] ${isToday(date) ? 'bg-brand-50 text-brand-700' : ''}`}>
                            {view !== 'year' ? format(date, 'd') : ''}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {goodHabits.map((habit, idx) => (
                        <tr key={habit.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-surface-50/50'}>
                          <td className="p-3 text-sm text-surface-900 border-r border-surface-200 sticky left-0 z-10 bg-inherit font-medium truncate max-w-[192px]" title={habit.name}>
                            {habit.name}
                          </td>
                          {gridDays.map(date => (
                            <td key={date.toString()} className="p-1 border-b border-surface-100/50 text-center">
                              <div 
                                onClick={() => toggleHabit(habit.id, date)}
                                title={`${habit.name} on ${format(date, 'MMM d')}`}
                                className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto rounded transition-colors ${getHabitCellClass(habit.id, date)} ${isToday(date) ? 'ring-1 ring-brand-400' : ''}`}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
