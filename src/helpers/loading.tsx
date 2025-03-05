import { CircularProgress } from '@mui/material'


const Loading = () => {
  return (
<div style={{ 
  position: 'absolute', 
  top: '50%', 
  left: '50%', 
  transform: 'translateX(-50%)', 
  marginTop: 10 
}}>
  <CircularProgress />
</div>
  )
}

export default Loading