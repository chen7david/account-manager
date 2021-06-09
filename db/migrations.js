module.exports = {

    users: (table) => {
        table.increments().primary()
        table.string('userId').unique().notNullable()
        table.string('avatar').unique()
        table.string('username').notNullable().unique()
        table.string('email').notNullable().unique()
        table.string('password').notNullable()
        table.boolean('requiresEmailCheck').defaultTo('true')
        table.boolean('requiresDeviceCheck').defaultTo('false')
        table.boolean('isDeveloper').defaultTo(false)
        table.boolean('isTrusted').defaultTo('false')
        table.boolean('isSuspended').defaultTo(false)
        table.boolean('isDisabled').defaultTo(true)
        table.timestamps(true, true)
    },

    roles: (table) => {
        table.increments().primary()
        table.string('name').unique().notNullable()
        table.text('description')
        table.timestamps(true, true)
    },

    user_roles: (table) => {
        table.increments().primary()
        table.unique(['user_id', 'role_id'])
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index().notNullable()
        table.integer('role_id').references('id').inTable('roles').onDelete('CASCADE').index().notNullable()
        table.timestamps(true, true)
    },

    devices: (table) => {
        table.increments().primary()
        table.unique(['user_id', 'useragent'])
        table.string('deviceId').unique().notNullable()
        table.string('displayName').unique()
        table.text('useragent')
        table.boolean('isPrimary').defaultTo(false)
        table.boolean('isBlocked').defaultTo(false)
        table.boolean('isTrusted').defaultTo('false')
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index().notNullable()
        table.timestamps(true, true)
    },

    tokens: (table) => {
        table.increments().primary()
        table.string('tokenId').unique().notNullable()
        table.integer('screenTime').defaultTo(0)
        table.boolean('isRevoked').defaultTo(false)
        table.boolean('isActive').defaultTo(true)
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index().notNullable()
        table.integer('device_id').references('id').inTable('devices').onDelete('CASCADE').index().notNullable()
        table.timestamps(true, true)
    },

    codes: (table) => {
        table.increments().primary()
        table.unique(['user_id', 'code'])
        table.string('code').unique().notNullable()
        table.integer('type').defaultTo(0)
        table.boolean('isActive').defaultTo(true)
        table.integer('user_id').references('id').inTable('users').onDelete('CASCADE').index().notNullable()
        table.integer('device_id').references('id').inTable('devices').onDelete('CASCADE').index()
        table.timestamps(true, true)
    },
}