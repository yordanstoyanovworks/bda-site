import {defineType, defineField} from 'sanity'

export const city = defineType({
  name: 'city',
  title: 'Град',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Име',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
  ],
})
