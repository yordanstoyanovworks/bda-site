import {defineType, defineField} from 'sanity'

export const agency = defineType({
  name: 'agency',
  title: 'Агенция',
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
    defineField({
      name: 'website',
      title: 'Уебсайт',
      type: 'url',
      validation: (Rule) =>
        Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'image',
      title: 'Изображение',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'description',
      title: 'Описание',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'categories',
      title: 'Категории',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'category'}]}],
    }),
    defineField({
      name: 'cities',
      title: 'Градове',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'city'}]}],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'website',
    },
  },
})
