import React, { useState } from 'react'
import { Grid, Pagination, Center, Stack } from '@mantine/core'
import ServiceCard from './ServiceCard'

export default function ServiceList({ services, onEdit, onDelete, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1)
  
  const totalPages = Math.ceil(services.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedServices = services.slice(startIndex, endIndex)

  return (
    <Stack spacing="xl">
      <Grid gutter="md">
        {displayedServices.map(service => (
          <Grid.Col key={service.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <ServiceCard
              service={service}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </Grid.Col>
        ))}
      </Grid>
      
      {totalPages > 1 && (
        <Center mt="xl">
          <Pagination 
            total={totalPages} 
            value={currentPage}
            onChange={setCurrentPage}
            size="lg"
            radius="md"
            withEdges
          />
        </Center>
      )}
    </Stack>
  )
}
