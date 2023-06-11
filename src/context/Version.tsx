import React, { createContext, useContext, useState, ReactNode } from 'react'

export enum Version {
  V1 = 0,
  V2 = 1,
}

interface VersionContextType {
  changeVersion: (v: Version) => void
  version: Version
}
interface Props {
  children: ReactNode
}

const VersionContext = createContext<VersionContextType>(null!)

export const useVersion = () => useContext(VersionContext)

export const VersionProvider = ({ children }: Props) => {
  const [version, setVersion] = useState<Version>(Version.V2)

  const changeVersion = (ver: Version) => {
    setVersion(ver)
  }

  return <VersionContext.Provider value={{ changeVersion, version }}>{children}</VersionContext.Provider>
}
