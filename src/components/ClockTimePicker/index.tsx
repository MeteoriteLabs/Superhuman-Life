import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StyledEngineProvider } from '@mui/material/styles';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import PropTypes from 'prop-types';

export default function ResponsiveTimePickers({ label, disabled, onChange }) {
    return (
        <StyledEngineProvider injectFirst>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                    label={label}
                    disabled={disabled}
                    viewRenderers={{
                        hours: renderTimeViewClock,
                        minutes: renderTimeViewClock
                    }}
                    minutesStep={15}
                    onChange={onChange}
                />
            </LocalizationProvider>
        </StyledEngineProvider>
    );
}

ResponsiveTimePickers.propTypes = {
    label: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};
