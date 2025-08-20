import { Stack } from '@mui/material'
import { PropsWithChildren } from 'react'

export default function   ListCard({children}: PropsWithChildren) {

  return (
    <Stack>
      <Stack gap={2} width={"100%"} direction={"column"}>
        {children}
      </Stack>
    </Stack>
  )
}
