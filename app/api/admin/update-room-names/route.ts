// app/api/admin/update-room-names/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    await database.connect()
    
    // Update room names mapping
    const roomUpdates = [
      { oldName: 'Большая #1', newName: 'Big studio #1', id: 'drums1' },
      { oldName: 'Верхняя средняя #2', newName: 'Upper-medium #2', id: 'drums2' }, 
      { oldName: 'Верхняя малая #3', newName: 'Upper-small #3', id: 'guitar1' },
      // Also handle current English names in case they exist
      { oldName: 'Drum Room #1', newName: 'Big studio #1', id: 'drums1' },
      { oldName: 'Drum Room #2', newName: 'Upper-medium #2', id: 'drums2' },
      { oldName: 'Guitar Room #1', newName: 'Upper-small #3', id: 'guitar1' }
    ]
    
    const db = await database.connect()
    let totalUpdated = 0
    
    for (const update of roomUpdates) {
      // Update rooms table
      await new Promise<void>((resolve, reject) => {
        db.run(
          'UPDATE rooms SET name = ? WHERE name = ? OR id = ?',
          [update.newName, update.oldName, update.id],
          function(err) {
            if (err) {
              console.error(`Error updating room ${update.oldName}:`, err)
              reject(err)
            } else {
              if (this.changes > 0) {
                console.log(`Updated room: ${update.oldName} → ${update.newName}`)
                totalUpdated += this.changes
              }
              resolve()
            }
          }
        )
      })
      
      // Update bookings table roomName field
      await new Promise<void>((resolve, reject) => {
        db.run(
          'UPDATE bookings SET roomName = ? WHERE roomName = ?',
          [update.newName, update.oldName],
          function(err) {
            if (err) {
              console.error(`Error updating bookings for room ${update.oldName}:`, err)
              reject(err)
            } else {
              if (this.changes > 0) {
                console.log(`Updated ${this.changes} booking(s) with room name: ${update.oldName} → ${update.newName}`)
                totalUpdated += this.changes
              }
              resolve()
            }
          }
        )
      })
    }
    
    return NextResponse.json({
      success: true,
      message: `Successfully updated room names. Total records updated: ${totalUpdated}`,
      updatedRecords: totalUpdated
    })
    
  } catch (error) {
    console.error('Error updating room names:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update room names',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}