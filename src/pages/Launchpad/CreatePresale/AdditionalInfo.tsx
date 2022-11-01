/* eslint-disable */
import React from 'react'
import { CardBody } from '@evofinance9/uikit'

import { InputExtended, Flex, TextArea } from './styleds'

interface FormComponentProps {
  handleChange: (params: any) => any
  data: {
    logo_link: string
    website_link: string
    github_link: string
    twitter_link: string
    reddit_link: string
    telegram_link: string
    project_dec: string
    certik_audit: boolean
    doxxed_team: boolean
    utility: boolean
    kyc: boolean
  }
}

export default function AdditionalInfo({ handleChange, data }: FormComponentProps) {
  const { logo_link, website_link, github_link, twitter_link, reddit_link, telegram_link, project_dec } = data

  return (
    <CardBody>
      <Flex>
        <InputExtended
          placeholder="Logo Link (URL must end with a supported image extension png, jpg, jpeg or gif)"
          scale="lg"
          value={logo_link}
          onChange={handleChange('logo_link')}
        />

        <InputExtended
          placeholder="Website Link"
          scale="lg"
          value={website_link}
          onChange={handleChange('website_link')}
        />
      </Flex>

      <Flex>
        <InputExtended
          placeholder="GitHub Link"
          scale="lg"
          value={github_link}
          onChange={handleChange('github_link')}
        />

        <InputExtended
          placeholder="Twitter Link"
          scale="lg"
          value={twitter_link}
          onChange={handleChange('twitter_link')}
        />
      </Flex>

      <Flex>
        <InputExtended
          placeholder="Reddit Link"
          scale="lg"
          value={reddit_link}
          onChange={handleChange('reddit_link')}
        />

        <InputExtended
          placeholder="Telegram Link"
          scale="lg"
          value={telegram_link}
          onChange={handleChange('telegram_link')}
        />
      </Flex>

      <Flex>
        <TextArea
          rows={5}
          placeholder="Project Description"
          value={project_dec}
          onChange={handleChange('project_dec')}
        />
        {/* <InputExtended
          placeholder="Project Description"
          className="mt-3"
          scale="lg"
          value={project_dec}
          onChange={handleChange('project_dec')}
        /> */}
      </Flex>
    </CardBody>
  )
}
