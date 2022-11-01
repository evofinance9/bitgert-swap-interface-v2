/* eslint-disable */
import React from 'react'
import { DateTimePicker } from '@material-ui/pickers'
import { CardBody } from '@evofinance9/uikit'
import { TextField, withStyles } from '@material-ui/core'

interface FormComponentProps {
  handleChange: (params1: any, params2: any) => any
  data: { start_time: Date; end_time: Date; tier1_time: Date; tier2_time: Date; lock_time: Date }
}

const CssTextField = withStyles({
  root: {
    '&': {
      borderRadius: '6px',
      margin: '1rem 0',
    },
    '& label.Mui-focused': {
      color: '#aaa',
    },
    '& label': {
      color: '#000',
    },

    '& .MuiInputBase-input': {
      color: '#000',
      backgroundColor: '#fff',
      borderRadius: '6px',
      display: 'block',
      fontSize: '16px',
      height: '48px',
      outline: '0',
      borderColor: '#2669f5',
      padding: '0 16px',
    },
    '& .MuiInputBase-input:active': {
      border: '0',
    },
  },
})(TextField)

export default function Timing({ handleChange, data }: FormComponentProps) {
  const { start_time, end_time, tier1_time, tier2_time, lock_time } = data

  return (
    <CardBody>
      <DateTimePicker
        size="small"
        color="primary"
        inputVariant="outlined"
        label="Tier 1 Start Time"
        value={tier1_time}
        fullWidth
        onChange={(date) => {
          handleChange('tier1_time', date)
        }}
        TextFieldComponent={(params) => {
          return <CssTextField {...params} />
        }}
      />

      <DateTimePicker
        size="small"
        color="primary"
        label=" Tier 2 Start Time"
        fullWidth
        inputVariant="outlined"
        value={tier2_time}
        onChange={(date) => {
          handleChange('tier2_time', date)
        }}
        TextFieldComponent={(params) => {
          return <CssTextField {...params} />
        }}
      />

      <DateTimePicker
        size="small"
        label="Public Start Time"
        color="primary"
        inputVariant="outlined"
        value={start_time}
        fullWidth
        onChange={(date) => {
          handleChange('start_time', date)
        }}
        TextFieldComponent={(params) => {
          return <CssTextField {...params} />
        }}
      />

      <DateTimePicker
        size="small"
        label="Presale End Time"
        color="primary"
        fullWidth
        inputVariant="outlined"
        value={end_time}
        onChange={(date) => {
          handleChange('end_time', date)
        }}
        TextFieldComponent={(params) => {
          return <CssTextField {...params} />
        }}
      />

      <DateTimePicker
        size="small"
        color="primary"
        label="Liquidity Lock Time"
        inputVariant="outlined"
        fullWidth
        value={lock_time}
        onChange={(date) => {
          handleChange('lock_time', date)
        }}
        TextFieldComponent={(params) => {
          return <CssTextField {...params} />
        }}
      />
    </CardBody>
  )
}
