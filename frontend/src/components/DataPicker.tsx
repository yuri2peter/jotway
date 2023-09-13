// 封装的日期选择器，使用string的日期格式
// @mui/x-date-pickers的onchange机制不同于标准input，这会导致formik机制异常。
// 此处进行了一些处理，模拟了常规的onchange事件，并且使得数据格式统一为string。

import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { StandardTextFieldProps } from '@mui/material';

const pickers = {
  DATE_TIME: { picker: DateTimePicker, format: 'YYYY/MM/DD HH:mm' },
  DATE: { picker: DatePicker, format: 'YYYY/MM/DD' },
};

interface Props extends Omit<StandardTextFieldProps, 'onChange'> {
  type?: keyof typeof pickers;
  value: string;
  onChange: (event: any, timeString: string) => void;
  name?: string;
}

const MyDatePicker: React.FC<Props> = ({
  type = 'DATE',
  onChange,
  value,
  name,
  ...props
}) => {
  const [valueDate, setValueDate] = React.useState<Dayjs | null>(null);
  const refInput = React.useRef<HTMLInputElement | null>(null);
  React.useEffect(() => {
    if (value) {
      try {
        setValueDate(dayjs(value));
      } catch {
        setValueDate(null);
      }
    } else {
      setValueDate(null);
    }
    if (refInput.current) {
      refInput.current.value = value;
    }
  }, [value]);
  const Picker = pickers[type].picker;
  return (
    <>
      <Picker
        format={pickers[type].format}
        value={valueDate}
        ampm={false}
        slotProps={{
          textField: props,
        }}
        onChange={(v) => {
          setValueDate(v);
          if (refInput.current) {
            const s = v?.toISOString() || '';
            refInput.current.value = s;
            const e = {
              type: 'change',
              target: refInput.current,
            };
            onChange(e, s);
          }
        }}
      />
      <input ref={refInput} hidden name={name} />
    </>
  );
};

export default MyDatePicker;
