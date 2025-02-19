import { Box, Typography } from '@mui/material'
import Header from '../components/Header/Header'
import Conversation from '../components/Conversation/Conversation'
import Footer from '../components/Footer/Footer'

const ChatScreenPage = () => {
  return (
    <Box display={'flex'} flexDirection={'column'} width={'80%'} >
      <Header />
      <Conversation />
      <Footer />
</Box>
  )
}

export default ChatScreenPage