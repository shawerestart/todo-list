import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {
  Badge,
  Tab,
  Tabs,
  TabsHeader,
  ThemeProvider,
} from "@material-tailwind/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { createGlobalState } from "react-hooks-global-state";
import classNames from "classnames";
import "animate.css";

type TabProps = {
  name: string;
  path: string;
};

const initialState = { count: 0 };
export const { useGlobalState } = createGlobalState(initialState);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const [count, setCount] = useGlobalState("count");

  const [tabs, setTabs] = useState<TabProps[]>([
    {
      name: "To-do",
      path: "/",
    },
    {
      name: "Schedule",
      path: "/schedule",
    },
  ]);

  const [activeTab, setActiveTab] = useState<string>(router.pathname);

  const getScheduleCount = async () => {
    try {
      const res = await fetch(`/api/schedule`, {
        method: "GET",
      });
      const list = await res.json();
      setCount(list?.[0]?.length || 0);
    } catch (error) {
      console.error("getScheduleCount error", error);
    }
  };

  useEffect(() => {
    getScheduleCount();
  }, []);

  useEffect(() => {
    const tab = tabs.find((item) => item.path === activeTab);
    if (tab) {
      router.push(tab.path);
    }
  }, [activeTab]);
  return (
    <ThemeProvider>
      <div className="w-full">
        <Tabs value={activeTab}>
          <TabsHeader
            className="rounded-none border-b border-blue-gray-50 bg-transparent px-8 pt-2"
            indicatorProps={{
              className:
                "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
            }}
          >
            {tabs.map(({ name, path }) => (
              <Tab
                key={name}
                value={path}
                onClick={() => setActiveTab(path)}
                className={classNames(
                  "py-2",
                  activeTab === path ? "text-gray-900" : ""
                )}
              >
                {path === "/schedule" && count > 0 ? (
                  <Badge className="translate-x-full" content={count}>
                    {name}
                  </Badge>
                ) : (
                  <>{name}</>
                )}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
        <Component {...pageProps} />
      </div>
    </ThemeProvider>
  );
}
