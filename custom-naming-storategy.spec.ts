import { CustomNamingStrategy } from '~/custom-naming-storategy'

describe('custom-naming-storategy', () => {
    let namingStrategy: CustomNamingStrategy

    beforeAll(() => {
        namingStrategy = new CustomNamingStrategy()
    })

    it('should be defined', () => {
        expect(namingStrategy).toBeDefined()
    })

    describe('tableName', () => {
        it.each<[string, string]>([
            ['ExampleTableEntities', 'example_table'],
            ['UserEntities', 'user'],
        ])('%s to %s', (base, to) => {
            expect(namingStrategy.tableName(base, '')).toBe(to)
        })

        it('custom name', () => {
            expect(namingStrategy.tableName('UserEntities', 'customer')).toBe('customer')
        })
    })

    describe('columnName', () => {
        it.each<[string, string]>([
            ['id', 'id'],
            ['createdAt', 'created_at'],
        ])('%s to %s', (base, to) => {
            expect(namingStrategy.columnName(base, '', [])).toBe(to)
        })

        it('custom name', () => {
            expect(namingStrategy.columnName('createdAt', 'is_created', [])).toBe('is_created')
        })
    })

    describe('joinTableName', () => {
        it.each<[string, string, string]>([
            ['user', 'shopping_history', 'user_shopping_history'],
            ['tag', 'tag', 'tag_tag'],
            ['tags', 'tags', 'tags_tags'],
        ])('%s and %s -> %s', (first, second, res) => {
            expect(namingStrategy.joinTableName(first, second, '', '')).toBe(res)
        })
    })

    describe('joinTableColumnName', () => {
        it.each<[string, string, string, string]>([
            ['user', 'id', 'id', 'user_id'],
            ['users', 'uuid', 'id', 'user_id'],
            ['users', 'uuid', '', 'user_uuid'],
            ['subscription_history', 'id', 'id', 'subscription_history_id'],
            ['subscription_histories', 'id', 'id', 'subscription_history_id'],
        ])('%s.(%s||%s) -> %s', (tableName, propertyName, columnName, res) => {
            expect(namingStrategy.joinTableColumnName(tableName, propertyName, columnName)).toBe(res)
        })
    })
})
