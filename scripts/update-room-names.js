// scripts/update-room-names.js
const sqlite3 = require('sqlite3')
const path = require('path')

const dbPath = path.join(process.cwd(), 'bookings.db')

console.log('🔄 Updating room names in database...')

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to database:', err)
    process.exit(1)
  }
  
  console.log('✅ Connected to database')
  
  // Update room names
  const updates = [
    { oldName: 'Большая #1', newName: 'Big studio #1', id: 'drums1' },
    { oldName: 'Верхняя средняя #2', newName: 'Upper-medium #2', id: 'drums2' }, 
    { oldName: 'Верхняя малая #3', newName: 'Upper-small #3', id: 'guitar1' },
    // Also handle current English names in case they exist
    { oldName: 'Drum Room #1', newName: 'Big studio #1', id: 'drums1' },
    { oldName: 'Drum Room #2', newName: 'Upper-medium #2', id: 'drums2' },
    { oldName: 'Guitar Room #1', newName: 'Upper-small #3', id: 'guitar1' }
  ]
  
  let completed = 0
  
  updates.forEach((update) => {
    // Update rooms table
    db.run(
      'UPDATE rooms SET name = ? WHERE name = ? OR id = ?',
      [update.newName, update.oldName, update.id],
      function(err) {
        if (err) {
          console.error(`❌ Error updating room ${update.oldName}:`, err)
        } else if (this.changes > 0) {
          console.log(`✅ Updated room: ${update.oldName} → ${update.newName}`)
        }
        
        // Update bookings table roomName field
        db.run(
          'UPDATE bookings SET roomName = ? WHERE roomName = ?',
          [update.newName, update.oldName],
          function(err) {
            if (err) {
              console.error(`❌ Error updating bookings for room ${update.oldName}:`, err)
            } else if (this.changes > 0) {
              console.log(`✅ Updated ${this.changes} booking(s) with room name: ${update.oldName} → ${update.newName}`)
            }
            
            completed++
            if (completed === updates.length) {
              console.log('🎉 Room name update completed!')
              db.close((err) => {
                if (err) {
                  console.error('❌ Error closing database:', err)
                } else {
                  console.log('✅ Database connection closed')
                }
                process.exit(0)
              })
            }
          }
        )
      }
    )
  })
})