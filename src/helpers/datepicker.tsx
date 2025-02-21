import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type Props = {
  value: any;
  onChange: (e: any) => void;
  size: 'small' | "medium"
}

const Datepicker: React.FC<Props> = ({ value, onChange, size }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']} sx={{ padding: 0 }}>
        <DatePicker label="" format="DD/MM/YYYY" onChange={onChange} value={value} slotProps={{ textField: { size: size } }} sx={{ width: '100%' }} />
      </DemoContainer>
    </LocalizationProvider>
  )
}

export default Datepicker