**Timeline design**

### Views

**###** Entries:

**###** Day: 2-days (yesterday, today) (default view)

**###** Week

**###** Month

## Day/Week Timeslot settings

-- -- 5 Slots (5-9, 9-13, 13-17, 17-21, 21-24)
step={60}
timeslots={4}
min={moment("5:00am", "h:mma").toDate()}
max={moment("11:59pm", "h:mma").toDate()}

## Calculations

**#** deviation +/- %: calculated using user-meta-info: sex, weight, height, activity-level, reccommended calorie intake/day, etc.

## Data-UI Elements

**#** Entry-Info-Snippet:
Applicable: for each Entry,
Accessed:
-- -- Always visible - Entries,
-- -- clicking Entry-Title-Float - Day/Week
-- -- clicking Nutri-Report's links - Month
Structure: Tabular - Entries, Popup - Day/Week/Month
Data: (Date | Meal-Time | Entry Query | Entry Analysis Summary)
LinksTo: clicking getDetails, routed to EntryDetail component with goBack button

**#** Entry-Title-Float:
Applicable: for each Entry,
Accessed: Always visible - Day/Week
Structure: linear float - Day/Week
Data: Entry's Nutrition parsed Query

**#** Nutri-Status (Preview):
Applicable: for each Day,
Accessed:
Always visible - sub-header - Day/Week
Always visible - Day Slot - Month
Structure: faded large numerical display of total calories - color coded using deviation,
Data: total nutirition summary of all the entries of a specific past-day or of current-day's till that time (Num of entries | Total Energy Kcal | Deviation +/- %)

**#** Nutri-Report (Details):
Applicable: for each Day,
Accessed:
-- -- clicking Nutri-Status - Day/Week
-- -- clicking Day Slot - Month
Structure: Popup - Day/Week/Month
Data: total nutirition summary of all the entries of a specific past-day or of current-day's till that time (Num of entries | Total Energy Kcal | Deviation +/- % | Carbs | Fat | Protien | Sugar | Entry Titles - Parsed Entry queries/titles with popups to specific Entry-Info-Snippets)

## Entries

**#** Navigation: to prev and next day
**#** Empty Entry Slot onClick: Add Entry Form (pop-up / route component)
**#** Entry Slot: Entry Entry-Info-Snippet
**#** Entry Entry-Info-Snippet onClick: Entry Detail (routed to EntryDetail component with goBack)
**#** Entry Entry-Info-Snippet onClick: Entry Detail (routed to EntryDetail component with goBack)

## Day (2-days: last-day, today)

**#** Navigation: to prev and next day shifts last-day & today accordingly
**#** (last-day's status | today's status) Nutri-Status (Preview): Sub-header
**#** (last-day's status | today's status) Nutri-Status onClick: Nutri-Report (Details)
**#** Last-day's Empty Slot onClick: Day's Nutrition Summary (pop-up / route component - summary)
**#** Today's Empty Slot onClick: Add Entry Form (pop-up / route component)
**#** Day Slot: Entry-Title-Float (linear float: Entry Query)
**#** Entry-Title-Float onClick: Entry-Info-Snippet Popup

## Week

**#** Navigation: to prev and next week
**#** (<day-name>'s status | today's status) Nutri-Status (Preview): Sub-header
**#** (<day-name>'s status | today's status) Nutri-Status onClick: Nutri-Report (Details)
**#** Past Days of Week Empty Slot onClick: Add Entry Form (pop-up / route component)
**#** Today's Empty Slot onClick: Add Entry Form (pop-up / route component)
**#** Day Slot: Entry-Title-Float (linear float: Entry Query)
**#** Entry-Title-Float onClick: (popup: Date | Meal-Time | Entry Query | Entry Analysis Summary)

## Month

**#** Navigation: to prev and next week
**#** (<day-name>'s status | today's status) Nutri-Status (Preview): Sub-header
**#** (<day-name>'s status | today's status) Nutri-Status onClick: Nutri-Report (Details)
**#** Today's Slot onClick: Shifts to Today (Day) View
**#** <date>'s status Past Day's Slot Nutri-Status (Preview): Occupies Day Slot
**#** <date>'s status Past Day's Slot: Nutri-Status onClick: Popup Nutri-Report (Details)
